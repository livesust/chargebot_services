import { expect, test } from "vitest";
import { Component } from "../src/services/component";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await Component.create({
        "name": getRandom('varchar', 255),
        "version": getRandom('varchar', 100),
        "description": getRandom('text'),
        "specs": getRandom('text'),
        "location": getRandom('varchar', 255),
        "notes": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await Component.update(
        entity_id!,
        { "name": value }
    );
    expect(response).toBeDefined();
    expect(response!.name).toEqual(value);
});

test("List", async () => {
    const response = await Component.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await Component.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await Component.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await Component.list();
    await Component.remove(entity_id!, "unit_test");
    const list = await Component.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await Component.hard_remove(entity_id!);
});