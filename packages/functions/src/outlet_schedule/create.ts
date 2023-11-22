import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import { OutletSchedule } from "@chargebot-services/core/services/outlet_schedule";
import auditCreation from "../shared/middlewares/audit-create";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CreateOutletScheduleSchema, OutletScheduleResponseSchema } from "./outlet_schedule.schema";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any, context: any) => {
    console.log('Request to create OutletSchedule:', event, context);
    const outlet_schedule = await OutletSchedule.create(event.body);

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: outlet_schedule
    };
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    .use(jsonBodyParser())
    .use(auditCreation())
    .use(validator({ eventSchema: CreateOutletScheduleSchema }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: OutletScheduleResponseSchema }));