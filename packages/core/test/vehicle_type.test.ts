import { afterAll, describe, expect, it } from "vitest";
import { VehicleType } from "../src/services/vehicle_type";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveVehicleType() {
    // @ts-expect-error ignore error
    return VehicleType.create(getVehicleTypeInstance());
}

export async function removeVehicleType(id: number) {
    // run delete query to clean database
    await VehicleType.hard_remove(id);
}

function getVehicleTypeInstance() {
    return {
        "type": getRandom('varchar', 255),
        "description": getRandom('text'),
    };
}

describe('VehicleType Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeVehicleType(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveVehicleType();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await VehicleType.update(
            entity_id!,
            { "type": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await VehicleType.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await VehicleType.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await VehicleType.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await VehicleType.list();
        await VehicleType.remove(entity_id!, "unit_test");
        const list = await VehicleType.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
