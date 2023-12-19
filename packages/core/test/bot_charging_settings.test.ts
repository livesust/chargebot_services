import { afterAll, describe, expect, it } from "vitest";
import { BotChargingSettings } from "../src/services/bot_charging_settings";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveBotChargingSettings() {
    // @ts-expect-error ignore error
    return BotChargingSettings.create(getBotChargingSettingsInstance());
}

export async function removeBotChargingSettings(id: number) {
    // run delete query to clean database
    await BotChargingSettings.hard_remove(id);
}

function getBotChargingSettingsInstance() {
    return {
        "day_of_week": getRandom('varchar', 255),
        "all_day": getRandom('boolean'),
        "start_time": getRandom('timestamp'),
        "end_time": getRandom('timestamp'),
    };
}

describe('BotChargingSettings Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotChargingSettings(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotChargingSettings();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotChargingSettings.update(
            entity_id!,
            { "day_of_week": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotChargingSettings.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotChargingSettings.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotChargingSettings.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotChargingSettings.list();
        await BotChargingSettings.remove(entity_id!, "unit_test");
        const list = await BotChargingSettings.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
