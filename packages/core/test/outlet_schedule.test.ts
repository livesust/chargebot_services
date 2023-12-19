import { afterAll, describe, expect, it } from "vitest";
import { OutletSchedule } from "../src/services/outlet_schedule";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveOutletSchedule() {
    // @ts-expect-error ignore error
    return OutletSchedule.create(getOutletScheduleInstance());
}

export async function removeOutletSchedule(id: number) {
    // run delete query to clean database
    await OutletSchedule.hard_remove(id);
}

function getOutletScheduleInstance() {
    return {
        "day_of_week": getRandom('varchar', 255),
        "all_day": getRandom('boolean'),
        "start_time": getRandom('timestamp'),
        "end_time": getRandom('timestamp'),
    };
}

describe('OutletSchedule Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeOutletSchedule(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveOutletSchedule();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await OutletSchedule.update(
            entity_id!,
            { "day_of_week": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await OutletSchedule.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await OutletSchedule.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await OutletSchedule.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await OutletSchedule.list();
        await OutletSchedule.remove(entity_id!, "unit_test");
        const list = await OutletSchedule.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
