import { afterAll, describe, expect, it } from "vitest";
import { UniversalAppSettings } from "../src/services/universal_app_settings";
import { getRandom } from './utils';
import { getOrCreateAppSettingsType } from "./app_settings_type.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let app_settings_type;

export async function getOrCreateUniversalAppSettings() {
    let universal_app_settings = await UniversalAppSettings.findOneByCriteria({})
    if (!universal_app_settings) {
      // @ts-expect-error ignore error
      universal_app_settings = await createAndSaveUniversalAppSettings();
    }
    return universal_app_settings;
}

export async function createAndSaveUniversalAppSettings() {
    app_settings_type = await getOrCreateAppSettingsType();
    // @ts-expect-error ignore error
    return UniversalAppSettings.create(getUniversalAppSettingsInstance());
}

export async function removeUniversalAppSettings(id: number) {
    // run delete query to clean database
    await UniversalAppSettings.hard_remove(id);
}

function getUniversalAppSettingsInstance() {
    return {
        "setting_value": getRandom('varchar', 255),
        // @ts-expect-error ignore any type error
        "app_settings_type_id": app_settings_type.id,
    };
}

describe('UniversalAppSettings Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeUniversalAppSettings(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveUniversalAppSettings();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await UniversalAppSettings.update(
            entity_id!,
            { "setting_value": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await UniversalAppSettings.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await UniversalAppSettings.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await UniversalAppSettings.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await UniversalAppSettings.list();
        await UniversalAppSettings.remove(entity_id!, "unit_test");
        const list = await UniversalAppSettings.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
