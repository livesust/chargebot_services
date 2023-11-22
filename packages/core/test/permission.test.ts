import { expect, test } from "vitest";
import { Permission } from "../src/services/permission";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await Permission.create({
        "permission_name": getRandom('varchar', 255),
        "description": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await Permission.update(
        entity_id!,
        { "permission_name": value }
    );
    expect(response).toBeDefined();
    expect(response!.permission_name).toEqual(value);
});

test("List", async () => {
    const response = await Permission.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await Permission.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await Permission.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await Permission.list();
    await Permission.remove(entity_id!, "unit_test");
    const list = await Permission.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await Permission.hard_remove(entity_id!);
});