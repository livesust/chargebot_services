import { expect, test } from "vitest";
import { AlertType } from "../src/services/alert_type";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await AlertType.create({
        "name": getRandom('varchar', 255),
        "description": getRandom('text'),
        "priority": getRandom('enum'),
        "severity": getRandom('enum'),
        "color_code": getRandom('varchar', 100),
        "send_push": getRandom('boolean'),
        "alert_text": getRandom('varchar', 255),
        "alert_link": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await AlertType.update(
        entity_id!,
        { "name": value }
    );
    expect(response).toBeDefined();
    expect(response!.name).toEqual(value);
});

test("List", async () => {
    const response = await AlertType.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await AlertType.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await AlertType.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await AlertType.list();
    await AlertType.remove(entity_id!, "unit_test");
    const list = await AlertType.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await AlertType.hard_remove(entity_id!);
});