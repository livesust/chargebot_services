import { afterAll, describe, expect, it } from "vitest";
import { ComponentAttribute } from "../src/services/component_attribute";
import { getRandom } from './utils';
import { createAndSaveComponent, removeComponent } from "./component.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let component;

export async function createAndSaveComponentAttribute() {
    component = await createAndSaveComponent();
    // @ts-expect-error ignore error
    return ComponentAttribute.create(getComponentAttributeInstance());
}

export async function removeComponentAttribute(id: number) {
    // run delete query to clean database
    await ComponentAttribute.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeComponent(component.id);
}

function getComponentAttributeInstance() {
    return {
        "name": getRandom('varchar', 255),
        "type": getRandom('varchar', 255),
        // @ts-expect-error ignore any type error
        "component_id": component.id,
    };
}

describe('ComponentAttribute Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeComponentAttribute(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveComponentAttribute();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await ComponentAttribute.update(
            entity_id!,
            { "name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await ComponentAttribute.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await ComponentAttribute.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await ComponentAttribute.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await ComponentAttribute.list();
        await ComponentAttribute.remove(entity_id!, "unit_test");
        const list = await ComponentAttribute.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
