import { expect, test } from "vitest";
import { User } from "../src/services/user";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await User.create({
        "first_name": getRandom('varchar', 255),
        "last_name": getRandom('varchar', 255),
        "title": getRandom('varchar', 255),
        "photo": getRandom('varchar', 255),
        "invite_status": getRandom('integer'),
        "super_admin": getRandom('boolean'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await User.update(
        entity_id!,
        { "first_name": value }
    );
    expect(response).toBeDefined();
    expect(response!.first_name).toEqual(value);
});

test("List", async () => {
    const response = await User.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await User.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await User.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await User.list();
    await User.remove(entity_id!, "unit_test");
    const list = await User.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await User.hard_remove(entity_id!);
});