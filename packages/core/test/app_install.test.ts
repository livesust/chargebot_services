import { afterAll, describe, expect, it } from "vitest";
import { AppInstall } from "../src/services/app_install";
import { getRandom } from './utils';
import { getOrCreateUser } from "./user.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let user;

export async function getOrCreateAppInstall() {
    let app_install = await AppInstall.findOneByCriteria({})
    if (!app_install) {
      // @ts-expect-error ignore error
      app_install = await createAndSaveAppInstall();
    }
    return app_install;
}

export async function createAndSaveAppInstall() {
    user = await getOrCreateUser();
    // @ts-expect-error ignore error
    return AppInstall.create(getAppInstallInstance());
}

export async function removeAppInstall(id: number) {
    // run delete query to clean database
    await AppInstall.hard_remove(id);
}

function getAppInstallInstance() {
    return {
        "app_version": getRandom('varchar', 255),
        "platform": getRandom('varchar', 100),
        "os_version": getRandom('varchar', 100),
        "description": getRandom('text'),
        // @ts-expect-error ignore any type error
        "user_id": user.id,
    };
}

describe('AppInstall Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeAppInstall(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveAppInstall();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await AppInstall.update(
            entity_id!,
            { "app_version": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await AppInstall.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await AppInstall.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await AppInstall.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await AppInstall.list();
        await AppInstall.remove(entity_id!, "unit_test");
        const list = await AppInstall.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
