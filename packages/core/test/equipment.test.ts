import { afterAll, describe, expect, it } from "vitest";
import { Equipment } from "../src/services/equipment";
import { getRandom } from './utils';
import { createAndSaveEquipmentType, removeEquipmentType } from "./equipment_type.test";
import { createAndSaveCustomer, removeCustomer } from "./customer.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let equipment_type;
// @ts-expect-error ignore any type error
let customer;

export async function createAndSaveEquipment() {
    equipment_type = await createAndSaveEquipmentType();
    customer = await createAndSaveCustomer();
    return Equipment.create(getEquipmentInstance());
}

export async function removeEquipment(id: number) {
    // run delete query to clean database
    await Equipment.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeEquipmentType(equipment_type.id);
    // @ts-expect-error ignore any type error
    await removeCustomer(customer.id);
}

function getEquipmentInstance() {
    const instance = {
        "name": getRandom('varchar', 255),
        "brand": getRandom('varchar', 255),
        "description": getRandom('text'),
        "voltage": getRandom('float'),
        "max_charging_amps": getRandom('float'),
        // @ts-expect-error ignore any type error
        "equipment_type_id": equipment_type.id,
        // @ts-expect-error ignore any type error
        "customer_id": customer.id,
    };
    console.log('Equipment:', JSON.stringify(instance));
    return instance;
}

describe('Equipment Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeEquipment(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveEquipment();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await Equipment.update(
            entity_id!,
            { "name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Equipment.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Equipment.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Equipment.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Equipment.list();
        await Equipment.remove(entity_id!, "unit_test");
        const list = await Equipment.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
