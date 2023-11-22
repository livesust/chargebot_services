import { expect, test } from "vitest";
import { Role } from "../src/services/role";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await Role.create({
        "role": getRandom('varchar', 255),
        "description": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await Role.update(
        entity_id!,
        { "role": value }
    );
    expect(response).toBeDefined();
    expect(response!.role).toEqual(value);
});

test("List", async () => {
    const response = await Role.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await Role.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await Role.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await Role.list();
    await Role.remove(entity_id!, "unit_test");
    const list = await Role.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await Role.hard_remove(entity_id!);
});