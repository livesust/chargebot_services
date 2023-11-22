import { expect, test } from "vitest";
import { BotComponent } from "../src/services/bot_component";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await BotComponent.create({
        "install_date": getRandom('timestampz'),
        "component_serial": getRandom('varchar', 255),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('timestampz');
    const response = await BotComponent.update(
        entity_id!,
        { "install_date": value }
    );
    expect(response).toBeDefined();
    expect(response!.install_date).toEqual(value);
});

test("List", async () => {
    const response = await BotComponent.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await BotComponent.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await BotComponent.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await BotComponent.list();
    await BotComponent.remove(entity_id!, "unit_test");
    const list = await BotComponent.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await BotComponent.hard_remove(entity_id!);
});