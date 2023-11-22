import { expect, test } from "vitest";
import { ScheduledAlert } from "../src/services/scheduled_alert";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await ScheduledAlert.create({
        "name": getRandom('varchar', 255),
        "description": getRandom('text'),
        "alert_content": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await ScheduledAlert.update(
        entity_id!,
        { "name": value }
    );
    expect(response).toBeDefined();
    expect(response!.name).toEqual(value);
});

test("List", async () => {
    const response = await ScheduledAlert.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await ScheduledAlert.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await ScheduledAlert.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await ScheduledAlert.list();
    await ScheduledAlert.remove(entity_id!, "unit_test");
    const list = await ScheduledAlert.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await ScheduledAlert.hard_remove(entity_id!);
});