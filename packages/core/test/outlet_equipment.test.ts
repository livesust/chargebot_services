import { afterAll, describe, expect, it } from "vitest";
import { OutletEquipment } from "../src/services/outlet_equipment";
import { getRandom } from './utils';
import { createAndSaveEquipment, removeEquipment } from "./equipment.test";
import { createAndSaveOutlet, removeOutlet } from "./outlet.test";
import { createAndSaveUser, removeUser } from "./user.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let equipment;
// @ts-expect-error ignore any type error
let outlet;
// @ts-expect-error ignore any type error
let user;

export async function createAndSaveOutletEquipment() {
    equipment = await createAndSaveEquipment();
    outlet = await createAndSaveOutlet();
    user = await createAndSaveUser();
    // @ts-expect-error ignore error
    return OutletEquipment.create(getOutletEquipmentInstance());
}

export async function removeOutletEquipment(id: number) {
    // run delete query to clean database
    await OutletEquipment.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeEquipment(equipment.id);
    // @ts-expect-error ignore any type error
    await removeOutlet(outlet.id);
    // @ts-expect-error ignore any type error
    await removeUser(user.id);
}

function getOutletEquipmentInstance() {
    return {
        "notes": getRandom('text'),
        // @ts-expect-error ignore any type error
        "equipment_id": equipment.id,
        // @ts-expect-error ignore any type error
        "outlet_id": outlet.id,
        // @ts-expect-error ignore any type error
        "user_id": user.id,
    };
}

describe('OutletEquipment Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeOutletEquipment(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveOutletEquipment();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await OutletEquipment.update(
            entity_id!,
            { "notes": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await OutletEquipment.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await OutletEquipment.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await OutletEquipment.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await OutletEquipment.list();
        await OutletEquipment.remove(entity_id!, "unit_test");
        const list = await OutletEquipment.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
