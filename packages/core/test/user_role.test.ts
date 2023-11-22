import { expect, test } from "vitest";
import { UserRole } from "../src/services/user_role";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await UserRole.create({
        "all_bots": getRandom('boolean'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('boolean');
    const response = await UserRole.update(
        entity_id!,
        { "all_bots": value }
    );
    expect(response).toBeDefined();
    expect(response!.all_bots).toEqual(value);
});

test("List", async () => {
    const response = await UserRole.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await UserRole.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await UserRole.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await UserRole.list();
    await UserRole.remove(entity_id!, "unit_test");
    const list = await UserRole.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await UserRole.hard_remove(entity_id!);
});