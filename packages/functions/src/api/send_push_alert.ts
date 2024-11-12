import middy from "@middy/core";
import warmup from "@middy/warmup";
import { createError, HttpError } from '@middy/util';
import Log from '@dazn/lambda-powertools-logger';
import httpErrorHandler from "@middy/http-error-handler";
import { EntitySchema } from "../schemas/send_push_alert.schema";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
// import executionTimeLogger from '../shared/middlewares/time-log';
// import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';
import { createNotFoundResponse, createSuccessResponse, isWarmingUp } from "../shared/rest_utils";
import { Bot } from "@chargebot-services/core/services/bot";
import { BotUser } from "@chargebot-services/core/services/bot_user";
import { AppInstall } from "@chargebot-services/core/services/app_install";
import { SuccessResponseSchema } from "src/shared/schemas";
import jsonBodyParser from "@middy/http-json-body-parser";
import { dateReviver } from "src/shared/middlewares/json-date-parser";
import { ExpoPush, Notification } from "@chargebot-services/core/services/expo/expo_push";
import i18n from '../shared/i18n/i18n';
import { ChargebotGps } from "@chargebot-services/core/services/analytics/chargebot_gps";
import { AlertName } from "@chargebot-services/core/timescale/chargebot_alert";
import { ChargebotGeocoding } from "@chargebot-services/core/services/analytics/chargebot_geocoding";
import { Equipment } from "@chargebot-services/core/services/equipment";

// @ts-expect-error ignore any type for event
const handler = async (event) => {
  // payload will come on body when called from API
  // but direct on event when from IoT
  const alert = event.body ?? event;

  // bot_uuid from IoT, device_id from API
  const bot_uuid = alert.bot_uuid ?? alert.device_id;

  try {
    if (!bot_uuid) {
      return createNotFoundResponse({ "response": "bot uuid not provided" });
    }

    const bot = await Bot.findOneByCriteria({ bot_uuid });
    if (!bot) {
      Log.info("Bot not found");
      return createNotFoundResponse({ "response": "bot not found" });
    }

    const notification = await AlertHandlerBuilder
      .build(bot_uuid)
      .process(alert);

    if (!notification) {
      return createSuccessResponse({ "response": "success" });
    }

    const usersByBot = await BotUser.findByCriteria({ bot_id: bot.id });
    const user_ids = usersByBot.map(ub => ub.user_id);
    const appInstalls = await AppInstall.getAppsToNotify(user_ids);
    const pushTokens = appInstalls?.map(ai => ai.push_token!);

    if (pushTokens && pushTokens.length > 0) {
      Log.info("SENT ALERT", { title: notification.title, pushTokens });
      ExpoPush.send_push_notifications(pushTokens, notification)
    } else {
      Log.info("No users to be notified");
    }

    return createSuccessResponse({ "response": "success" });

  } catch (error) {
    Log.error("ERROR", { error, alert });
    if (error instanceof HttpError) {
      // re-throw when is a http error generated above
      throw error;
    }
    const httpError = createError(406, "cannot send alert", { expose: true });
    httpError.details = (<Error>error).message;
    throw httpError;
  }
};

export const main = middy(handler)
  // before
  .use(warmup({ isWarmingUp }))
  // .use(executionTimeLogger())
  .use(httpEventNormalizer())
  // .use(logTimeout())
  .use(jsonBodyParser({ reviver: dateReviver }))
  .use(validator({ eventSchema: EntitySchema }))
  // after: inverse order execution
  .use(jsonBodySerializer())
  .use(httpSecurityHeaders())
  .use(validator({ responseSchema: SuccessResponseSchema }))
  // httpErrorHandler must be the last error handler attached, first to execute.
  // When non-http errors (those without statusCode) occur they will be returned with a 500 status code.
  .use(httpErrorHandler());

class AlertHandlerBuilder {
    static build(botUuid: string): AlertHandler {
      const policy: AlertHandler = new AlertFilterHandler(botUuid);
      policy.setNext(new LatLongAlertHandler(botUuid));
      policy.setNext(new LongStopAlertHandler(botUuid));
      policy.setNext(new EquipmentAlertHandler(botUuid));
      policy.setNext(new DefaultAlertHandler(botUuid));
      return policy;
    }
}

abstract class AlertHandler {  
  protected nextHandler: AlertHandler | null = null;

  abstract process(alert: Record<string, unknown>, notif?: Notification | undefined): Promise<Notification | undefined>;

  setNext(handler: AlertHandler): AlertHandler {
    this.nextHandler = handler;
    return handler; // Return handler to allow chaining
  }
}

export abstract class AbstractAlertHandler extends AlertHandler {

  bot_uuid: string;
  constructor(botUuid: string) {
    super();
    this.bot_uuid = botUuid;
  }

  async process(alert: Record<string, unknown>, notif?: Notification | undefined): Promise<Notification | undefined> {
    if (this.nextHandler) {
      return this.nextHandler.process(alert, notif);
    }
    return undefined;
  }
}

export class AlertFilterHandler extends AbstractAlertHandler {
  async process(alert: Record<string, unknown>, notif?: Notification | undefined): Promise<Notification | undefined> {
    const alertsToFilter = [AlertName.BATTERY_CHARGING, AlertName.BATTERY_DISCHARGING, AlertName.BATTERY_TEMPERATURE_NORMALIZED];
    if (alertsToFilter.some(a => alert.name === a.toString())) {
      Log.info("Alert filtered, not sending push:", alert);
      return undefined;
    }
    return super.process(alert, notif);
  }
}

export class LatLongAlertHandler extends AbstractAlertHandler {
  async process(alert: Record<string, unknown>, notif?: Notification | undefined): Promise<Notification | undefined> {
    if (alert && alert?.name !== AlertName.ABSENT_EQUIPMENT.toString()) {
      return notif;
    }

    const latitude = alert['lat'] ? Number(alert['lat']) : null;
    const longitude = alert['lon'] ? Number(alert['lon']) : null;
    if (latitude && longitude) {
      const geocode = await ChargebotGeocoding.getByLatLon(latitude, longitude);
      return {
        ...(notif ?? {}),
        data: {
          ...(notif?.data ?? {}),
          address: geocode ? `${geocode.street}, ${geocode.address_number}` : i18n.__('current_location')
        }
      };
    }

    return super.process(alert, notif);
  }
}

export class EquipmentAlertHandler extends AbstractAlertHandler {
  async process(alert: Record<string, unknown>, notif?: Notification | undefined): Promise<Notification | undefined> {
    if (alert && alert?.name !== AlertName.ABSENT_EQUIPMENT.toString()) {
      return notif;
    }

    const rfid = alert['rfid'] ?? null;
    if (rfid) {
      const equipment = await Equipment.findOneByCriteria({rfid: rfid as string});
      return {
        ...(notif ?? {}),
        data: {
          ...(notif?.data ?? {}),
          equipment: equipment ? equipment.name : i18n.__('generic_equipment')
        }
      };
    }
    return super.process(alert, notif);
  }
}

export class LongStopAlertHandler extends AbstractAlertHandler {
  async process(alert: Record<string, unknown>, notif?: Notification | undefined): Promise<Notification | undefined> {
    if (alert && alert?.name !== AlertName.GPS_LONG_STOP.toString()) {
      return notif;
    }
    
    const location = await ChargebotGps.getLastPositionByBot(this.bot_uuid);
    if (location) {
      return {
        ...(notif ?? {}),
        data: {
          ...(notif?.data ?? {}),
          address: location.address ?? i18n.__('current_location')
        }
      };
    }

    return super.process(alert, notif);
  }
}

export class DefaultAlertHandler extends AbstractAlertHandler {
  async process(alert: Record<string, unknown>, notif?: Notification | undefined): Promise<Notification | undefined> {
    if (alert !== null) {
      const name = alert['name'];
      const message = alert['message'];
      // merge all data
      const data = {
        // data coming from original alert
        ...(typeof(message) === "string" ? JSON.parse(message) : message),
        // data added by alert handlers
        ...(notif?.data ?? {}),
        // bot uuid
        bot_uuid: this.bot_uuid
      };
      return {
        title: notif?.title ?? i18n.__(`push_alerts.${name}.title`),
        message: notif?.message ?? i18n.__(`push_alerts.${name}.message`, data),
        data
      };
    }
    return super.process(alert, notif);
  }
}
