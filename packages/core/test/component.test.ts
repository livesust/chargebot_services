import { afterAll, describe, expect, it } from "vitest";
import { Component } from "../src/services/component";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveComponent() {
    return Component.create(getComponentInstance());
}

export async function removeComponent(id: number) {
    // run delete query to clean database
    await Component.hard_remove(id);
}

function getComponentInstance() {
    const instance = {
        "name": getRandom('varchar', 255),
        "version": getRandom('varchar', 100),
        "description": getRandom('text'),
        "specs": getRandom('text'),
        "location": getRandom('varchar', 255),
        "notes": getRandom('text'),
    };
    console.log('Component:', JSON.stringify(instance));
    return instance;
}

describe('Component Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeComponent(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveComponent();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await Component.update(
            entity_id!,
            { "name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Component.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Component.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Component.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Component.list();
        await Component.remove(entity_id!, "unit_test");
        const list = await Component.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
