import { afterAll, describe, expect, it } from "vitest";
import { EquipmentType } from "../src/services/equipment_type";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function getOrCreateEquipmentType() {
    let equipment_type = await EquipmentType.findOneByCriteria({})
    if (!equipment_type) {
      // @ts-expect-error ignore error
      equipment_type = await createAndSaveEquipmentType();
    }
    return equipment_type;
}

export async function createAndSaveEquipmentType() {
    // @ts-expect-error ignore error
    return EquipmentType.create(getEquipmentTypeInstance());
}

export async function removeEquipmentType(id: number) {
    // run delete query to clean database
    await EquipmentType.hard_remove(id);
}

function getEquipmentTypeInstance() {
    return {
        "type": getRandom('varchar', 255),
        "description": getRandom('text'),
    };
}

describe('EquipmentType Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeEquipmentType(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveEquipmentType();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await EquipmentType.update(
            entity_id!,
            { "type": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await EquipmentType.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await EquipmentType.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await EquipmentType.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await EquipmentType.list();
        await EquipmentType.remove(entity_id!, "unit_test");
        const list = await EquipmentType.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
