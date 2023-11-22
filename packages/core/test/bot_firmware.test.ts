import { expect, test } from "vitest";
import { BotFirmware } from "../src/services/bot_firmware";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await BotFirmware.create({
        "inverter_version": getRandom('varchar', 255),
        "pi_version": getRandom('varchar', 255),
        "firmware_version": getRandom('varchar', 255),
        "battery_version": getRandom('varchar', 255),
        "pdu_version": getRandom('varchar', 255),
        "notes": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await BotFirmware.update(
        entity_id!,
        { "inverter_version": value }
    );
    expect(response).toBeDefined();
    expect(response!.inverter_version).toEqual(value);
});

test("List", async () => {
    const response = await BotFirmware.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await BotFirmware.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await BotFirmware.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await BotFirmware.list();
    await BotFirmware.remove(entity_id!, "unit_test");
    const list = await BotFirmware.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await BotFirmware.hard_remove(entity_id!);
});