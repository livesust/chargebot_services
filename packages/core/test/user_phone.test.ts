import { expect, test } from "vitest";
import { UserPhone } from "../src/services/user_phone";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await UserPhone.create({
        "phone_number": getRandom('text'),
        "send_text": getRandom('boolean'),
        "primary": getRandom('boolean'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('text');
    const response = await UserPhone.update(
        entity_id!,
        { "phone_number": value }
    );
    expect(response).toBeDefined();
    expect(response!.phone_number).toEqual(value);
});

test("List", async () => {
    const response = await UserPhone.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await UserPhone.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await UserPhone.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await UserPhone.list();
    await UserPhone.remove(entity_id!, "unit_test");
    const list = await UserPhone.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await UserPhone.hard_remove(entity_id!);
});