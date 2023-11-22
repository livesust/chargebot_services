import { expect, test } from "vitest";
import { BotCompany } from "../src/services/bot_company";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await BotCompany.create({
        "acquire_date": getRandom('timestampz'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('timestampz');
    const response = await BotCompany.update(
        entity_id!,
        { "acquire_date": value }
    );
    expect(response).toBeDefined();
    expect(response!.acquire_date).toEqual(value);
});

test("List", async () => {
    const response = await BotCompany.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await BotCompany.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await BotCompany.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await BotCompany.list();
    await BotCompany.remove(entity_id!, "unit_test");
    const list = await BotCompany.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await BotCompany.hard_remove(entity_id!);
});