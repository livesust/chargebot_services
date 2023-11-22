import { expect, test } from "vitest";
import { BotUser } from "../src/services/bot_user";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await BotUser.create({
        "assignment_date": getRandom('timestampz'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('timestampz');
    const response = await BotUser.update(
        entity_id!,
        { "assignment_date": value }
    );
    expect(response).toBeDefined();
    expect(response!.assignment_date).toEqual(value);
});

test("List", async () => {
    const response = await BotUser.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await BotUser.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await BotUser.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await BotUser.list();
    await BotUser.remove(entity_id!, "unit_test");
    const list = await BotUser.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await BotUser.hard_remove(entity_id!);
});