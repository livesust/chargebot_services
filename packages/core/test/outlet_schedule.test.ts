import { expect, test } from "vitest";
import { OutletSchedule } from "../src/services/outlet_schedule";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await OutletSchedule.create({
        "day_of_week": getRandom('enum'),
        "all_day": getRandom('boolean'),
        "start_time": getRandom('timestamp'),
        "end_time": getRandom('timestamp'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('enum');
    const response = await OutletSchedule.update(
        entity_id!,
        { "day_of_week": value }
    );
    expect(response).toBeDefined();
    expect(response!.day_of_week).toEqual(value);
});

test("List", async () => {
    const response = await OutletSchedule.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await OutletSchedule.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await OutletSchedule.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await OutletSchedule.list();
    await OutletSchedule.remove(entity_id!, "unit_test");
    const list = await OutletSchedule.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await OutletSchedule.hard_remove(entity_id!);
});