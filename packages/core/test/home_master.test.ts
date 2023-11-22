import { expect, test } from "vitest";
import { HomeMaster } from "../src/services/home_master";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await HomeMaster.create({
        "address_line_1": getRandom('text'),
        "address_line_2": getRandom('string'),
        "city": getRandom('varchar', 100),
        "zip_code": getRandom('varchar', 100),
        "latitude": getRandom('float'),
        "longitude": getRandom('float'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('text');
    const response = await HomeMaster.update(
        entity_id!,
        { "address_line_1": value }
    );
    expect(response).toBeDefined();
    expect(response!.address_line_1).toEqual(value);
});

test("List", async () => {
    const response = await HomeMaster.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await HomeMaster.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await HomeMaster.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await HomeMaster.list();
    await HomeMaster.remove(entity_id!, "unit_test");
    const list = await HomeMaster.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await HomeMaster.hard_remove(entity_id!);
});