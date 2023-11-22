import { expect, test } from "vitest";
import { StateMaster } from "../src/services/state_master";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await StateMaster.create({
        "name": getRandom('varchar', 100),
        "abbreviation": getRandom('varchar', 45),
        "country": getRandom('varchar', 255),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await StateMaster.update(
        entity_id!,
        { "name": value }
    );
    expect(response).toBeDefined();
    expect(response!.name).toEqual(value);
});

test("List", async () => {
    const response = await StateMaster.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await StateMaster.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await StateMaster.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await StateMaster.list();
    await StateMaster.remove(entity_id!, "unit_test");
    const list = await StateMaster.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await StateMaster.hard_remove(entity_id!);
});