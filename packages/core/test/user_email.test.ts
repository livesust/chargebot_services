import { expect, test } from "vitest";
import { UserEmail } from "../src/services/user_email";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await UserEmail.create({
        "email_address": getRandom('text'),
        "verified": getRandom('boolean'),
        "primary": getRandom('boolean'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('text');
    const response = await UserEmail.update(
        entity_id!,
        { "email_address": value }
    );
    expect(response).toBeDefined();
    expect(response!.email_address).toEqual(value);
});

test("List", async () => {
    const response = await UserEmail.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await UserEmail.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await UserEmail.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await UserEmail.list();
    await UserEmail.remove(entity_id!, "unit_test");
    const list = await UserEmail.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await UserEmail.hard_remove(entity_id!);
});