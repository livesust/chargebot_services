import { expect, test } from "vitest";
import { EquipmentType } from "../src/services/equipment_type";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await EquipmentType.create({
        "type": getRandom('varchar', 255),
        "description": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await EquipmentType.update(
        entity_id!,
        { "type": value }
    );
    expect(response).toBeDefined();
    expect(response!.type).toEqual(value);
});

test("List", async () => {
    const response = await EquipmentType.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await EquipmentType.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await EquipmentType.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await EquipmentType.list();
    await EquipmentType.remove(entity_id!, "unit_test");
    const list = await EquipmentType.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await EquipmentType.hard_remove(entity_id!);
});