import { expect, test } from "vitest";
import { BotChargingSettings } from "../src/services/bot_charging_settings";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await BotChargingSettings.create({
        "day_of_week": getRandom('enum'),
        "all_day": getRandom('boolean'),
        "start_time": getRandom('timestamp'),
        "end_time": getRandom('timestamp'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('enum');
    const response = await BotChargingSettings.update(
        entity_id!,
        { "day_of_week": value }
    );
    expect(response).toBeDefined();
    expect(response!.day_of_week).toEqual(value);
});

test("List", async () => {
    const response = await BotChargingSettings.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await BotChargingSettings.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await BotChargingSettings.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await BotChargingSettings.list();
    await BotChargingSettings.remove(entity_id!, "unit_test");
    const list = await BotChargingSettings.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await BotChargingSettings.hard_remove(entity_id!);
});