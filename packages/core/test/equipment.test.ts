import { expect, test } from "vitest";
import { Equipment } from "../src/services/equipment";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await Equipment.create({
        "name": getRandom('varchar', 255),
        "brand": getRandom('varchar', 255),
        "description": getRandom('text'),
        "voltage": getRandom('float'),
        "max_charging_amps": getRandom('float'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await Equipment.update(
        entity_id!,
        { "name": value }
    );
    expect(response).toBeDefined();
    expect(response!.name).toEqual(value);
});

test("List", async () => {
    const response = await Equipment.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await Equipment.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await Equipment.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await Equipment.list();
    await Equipment.remove(entity_id!, "unit_test");
    const list = await Equipment.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await Equipment.hard_remove(entity_id!);
});