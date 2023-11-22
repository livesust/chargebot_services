import { expect, test } from "vitest";
import { BotVersion } from "../src/services/bot_version";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await BotVersion.create({
        "version_number": getRandom('varchar', 255),
        "version_name": getRandom('varchar', 255),
        "notes": getRandom('text'),
        "active_date": getRandom('timestampz'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await BotVersion.update(
        entity_id!,
        { "version_number": value }
    );
    expect(response).toBeDefined();
    expect(response!.version_number).toEqual(value);
});

test("List", async () => {
    const response = await BotVersion.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await BotVersion.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await BotVersion.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await BotVersion.list();
    await BotVersion.remove(entity_id!, "unit_test");
    const list = await BotVersion.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await BotVersion.hard_remove(entity_id!);
});