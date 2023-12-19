import { afterAll, describe, expect, it } from "vitest";
import { BotAlert } from "../src/services/bot_alert";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveBotAlert() {
    // @ts-expect-error ignore error
    return BotAlert.create(getBotAlertInstance());
}

export async function removeBotAlert(id: number) {
    // run delete query to clean database
    await BotAlert.hard_remove(id);
}

function getBotAlertInstance() {
    return {
        "message_displayed": getRandom('text'),
        "push_sent": getRandom('boolean'),
        "send_time": getRandom('timestamptz'),
        "display_time": getRandom('timestamptz'),
        "show": getRandom('boolean'),
        "dismissed": getRandom('boolean'),
        "active": getRandom('boolean'),
        "alert_count": getRandom('integer'),
    };
}

describe('BotAlert Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotAlert(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotAlert();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotAlert.update(
            entity_id!,
            { "message_displayed": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotAlert.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotAlert.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotAlert.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotAlert.list();
        await BotAlert.remove(entity_id!, "unit_test");
        const list = await BotAlert.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
