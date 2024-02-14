import { afterAll, describe, expect, it } from "vitest";
import { Vehicle } from "../src/services/vehicle";
import { getRandom } from './utils';
import { getOrCreateVehicleType } from "./vehicle_type.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let vehicle_type;

export async function getOrCreateVehicle() {
    let vehicle = await Vehicle.findOneByCriteria({})
    if (!vehicle) {
      // @ts-expect-error ignore error
      vehicle = await createAndSaveVehicle();
    }
    return vehicle;
}

export async function createAndSaveVehicle() {
    vehicle_type = await getOrCreateVehicleType();
    // @ts-expect-error ignore error
    return Vehicle.create(getVehicleInstance());
}

export async function removeVehicle(id: number) {
    // run delete query to clean database
    await Vehicle.hard_remove(id);
}

function getVehicleInstance() {
    return {
        "name": getRandom('text'),
        "license_plate": getRandom('text'),
        "notes": getRandom('text'),
        // @ts-expect-error ignore any type error
        "vehicle_type_id": vehicle_type.id,
    };
}

describe('Vehicle Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeVehicle(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveVehicle();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await Vehicle.update(
            entity_id!,
            { "name": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Vehicle.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Vehicle.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Vehicle.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Vehicle.list();
        await Vehicle.remove(entity_id!, "unit_test");
        const list = await Vehicle.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
