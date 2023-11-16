import { expect, test } from "vitest";
import { Customer } from "../src/services/customer";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await Customer.create({
        "name": getRandom('text'),
        "email": getRandom('text'),
        "first_order_date": getRandom('timestamptz'),
    }, "unit test");
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('text');
    const response = await Customer.update(
        entity_id!,
        { "name": value },
        "unit test"
    );
    expect(response).toBeDefined();
    expect(response!.name).toEqual(value);
});

test("List", async () => {
    const response = await Customer.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await Customer.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await Customer.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await Customer.list();
    await Customer.remove(entity_id!, "unit test");
    const list = await Customer.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();
});