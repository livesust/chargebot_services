import { afterAll, describe, expect, it } from "vitest";
import { BotScheduledAlert } from "../src/services/bot_scheduled_alert";
import { getRandom } from './utils';
import { createAndSaveBot, removeBot } from "./bot.test";
import { createAndSaveScheduledAlert, removeScheduledAlert } from "./scheduled_alert.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot;
// @ts-expect-error ignore any type error
let scheduled_alert;

export async function createAndSaveBotScheduledAlert() {
    bot = await createAndSaveBot();
    scheduled_alert = await createAndSaveScheduledAlert();
    // @ts-expect-error ignore error
    return BotScheduledAlert.create(getBotScheduledAlertInstance());
}

export async function removeBotScheduledAlert(id: number) {
    // run delete query to clean database
    await BotScheduledAlert.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeBot(bot.id);
    // @ts-expect-error ignore any type error
    await removeScheduledAlert(scheduled_alert.id);
}

function getBotScheduledAlertInstance() {
    return {
        "alert_status": getRandom('boolean'),
        "settings": getRandom('json'),
        // @ts-expect-error ignore any type error
        "bot_id": bot.id,
        // @ts-expect-error ignore any type error
        "scheduled_alert_id": scheduled_alert.id,
    };
}

describe('BotScheduledAlert Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotScheduledAlert(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotScheduledAlert();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotScheduledAlert.update(
            entity_id!,
            { "alert_status": getRandom('boolean') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotScheduledAlert.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotScheduledAlert.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotScheduledAlert.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotScheduledAlert.list();
        await BotScheduledAlert.remove(entity_id!, "unit_test");
        const list = await BotScheduledAlert.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
