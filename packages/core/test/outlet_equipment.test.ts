import { expect, test } from "vitest";
import { OutletEquipment } from "../src/services/outlet_equipment";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await OutletEquipment.create({
        "notes": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('text');
    const response = await OutletEquipment.update(
        entity_id!,
        { "notes": value }
    );
    expect(response).toBeDefined();
    expect(response!.notes).toEqual(value);
});

test("List", async () => {
    const response = await OutletEquipment.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await OutletEquipment.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await OutletEquipment.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await OutletEquipment.list();
    await OutletEquipment.remove(entity_id!, "unit_test");
    const list = await OutletEquipment.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await OutletEquipment.hard_remove(entity_id!);
});