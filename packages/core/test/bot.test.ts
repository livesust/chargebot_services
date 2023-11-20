import { expect, test } from "vitest";
import { Bot } from "../src/services/bot";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await Bot.create({
        "bot_uuid": getRandom('text'),
        "initials": getRandom('varchar', 2),
        "name": getRandom('varchar', 255),
        "pin_color": getRandom('varchar', 100),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('text');
    const response = await Bot.update(
        entity_id!,
        { "bot_uuid": value }
    );
    expect(response).toBeDefined();
    expect(response!.bot_uuid).toEqual(value);
});

test("List", async () => {
    const response = await Bot.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await Bot.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await Bot.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await Bot.list();
    await Bot.remove(entity_id!, "unit_test");
    const list = await Bot.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await Bot.hard_remove(entity_id!);
});