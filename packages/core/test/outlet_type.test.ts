import { afterAll, describe, expect, it } from "vitest";
import { OutletType } from "../src/services/outlet_type";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function getOrCreateOutletType() {
    let outlet_type = await OutletType.findOneByCriteria({})
    if (!outlet_type) {
      // @ts-expect-error ignore error
      outlet_type = await createAndSaveOutletType();
    }
    return outlet_type;
}

export async function createAndSaveOutletType() {
    // @ts-expect-error ignore error
    return OutletType.create(getOutletTypeInstance());
}

export async function removeOutletType(id: number) {
    // run delete query to clean database
    await OutletType.hard_remove(id);
}

function getOutletTypeInstance() {
    return {
        "type": getRandom('varchar', 255),
        "outlet_amps": getRandom('float'),
        "outlet_volts": getRandom('float'),
        "connector": getRandom('varchar', 100),
        "description": getRandom('text'),
    };
}

describe('OutletType Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeOutletType(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveOutletType();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await OutletType.update(
            entity_id!,
            { "type": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await OutletType.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await OutletType.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await OutletType.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await OutletType.list();
        await OutletType.remove(entity_id!, "unit_test");
        const list = await OutletType.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
