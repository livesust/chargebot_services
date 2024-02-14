import { afterAll, describe, expect, it } from "vitest";
import { AppSettingsType } from "../src/services/app_settings_type";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function getOrCreateAppSettingsType() {
    let app_settings_type = await AppSettingsType.findOneByCriteria({})
    if (!app_settings_type) {
      // @ts-expect-error ignore error
      app_settings_type = await createAndSaveAppSettingsType();
    }
    return app_settings_type;
}

export async function createAndSaveAppSettingsType() {
    // @ts-expect-error ignore error
    return AppSettingsType.create(getAppSettingsTypeInstance());
}

export async function removeAppSettingsType(id: number) {
    // run delete query to clean database
    await AppSettingsType.hard_remove(id);
}

function getAppSettingsTypeInstance() {
    return {
        "setting_name": getRandom('varchar', 100),
        "description": getRandom('text'),
    };
}

describe('AppSettingsType Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeAppSettingsType(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveAppSettingsType();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await AppSettingsType.update(
            entity_id!,
            { "setting_name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await AppSettingsType.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await AppSettingsType.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await AppSettingsType.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await AppSettingsType.list();
        await AppSettingsType.remove(entity_id!, "unit_test");
        const list = await AppSettingsType.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
