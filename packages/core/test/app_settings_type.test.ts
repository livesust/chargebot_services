import { expect, test } from "vitest";
import { AppSettingsType } from "../src/services/app_settings_type";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await AppSettingsType.create({
        "setting_name": getRandom('varchar', 100),
        "description": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await AppSettingsType.update(
        entity_id!,
        { "setting_name": value }
    );
    expect(response).toBeDefined();
    expect(response!.setting_name).toEqual(value);
});

test("List", async () => {
    const response = await AppSettingsType.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await AppSettingsType.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await AppSettingsType.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await AppSettingsType.list();
    await AppSettingsType.remove(entity_id!, "unit_test");
    const list = await AppSettingsType.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await AppSettingsType.hard_remove(entity_id!);
});