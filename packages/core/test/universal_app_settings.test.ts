import { expect, test } from "vitest";
import { UniversalAppSettings } from "../src/services/universal_app_settings";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await UniversalAppSettings.create({
        "setting_value": getRandom('varchar', 255),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await UniversalAppSettings.update(
        entity_id!,
        { "setting_value": value }
    );
    expect(response).toBeDefined();
    expect(response!.setting_value).toEqual(value);
});

test("List", async () => {
    const response = await UniversalAppSettings.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await UniversalAppSettings.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await UniversalAppSettings.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await UniversalAppSettings.list();
    await UniversalAppSettings.remove(entity_id!, "unit_test");
    const list = await UniversalAppSettings.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await UniversalAppSettings.hard_remove(entity_id!);
});