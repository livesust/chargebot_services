import { expect, test } from "vitest";
import { Company } from "../src/services/company";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await Company.create({
        "name": getRandom('varchar', 255),
        "emergency_phone": getRandom('varchar', 255),
        "emergency_email": getRandom('varchar', 255),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await Company.update(
        entity_id!,
        { "name": value }
    );
    expect(response).toBeDefined();
    expect(response!.name).toEqual(value);
});

test("List", async () => {
    const response = await Company.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await Company.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await Company.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await Company.list();
    await Company.remove(entity_id!, "unit_test");
    const list = await Company.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await Company.hard_remove(entity_id!);
});