import { afterAll, describe, expect, it } from "vitest";
import { AppInstallPermissions } from "../src/services/app_install_permissions";
import { getRandom } from './utils';
import { createAndSaveAppInstall, removeAppInstall } from "./app_install.test";
import { createAndSavePermission, removePermission } from "./permission.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let app_install;
// @ts-expect-error ignore any type error
let permission;

export async function createAndSaveAppInstallPermissions() {
    app_install = await createAndSaveAppInstall();
    permission = await createAndSavePermission();
    // @ts-expect-error ignore error
    return AppInstallPermissions.create(getAppInstallPermissionsInstance());
}

export async function removeAppInstallPermissions(id: number) {
    // run delete query to clean database
    await AppInstallPermissions.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeAppInstall(app_install.id);
    // @ts-expect-error ignore any type error
    await removePermission(permission.id);
}

function getAppInstallPermissionsInstance() {
    return {
        "permission_status": getRandom('boolean'),
        // @ts-expect-error ignore any type error
        "app_install_id": app_install.id,
        // @ts-expect-error ignore any type error
        "permission_id": permission.id,
    };
}

describe('AppInstallPermissions Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeAppInstallPermissions(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveAppInstallPermissions();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await AppInstallPermissions.update(
            entity_id!,
            { "permission_status": getRandom('boolean') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await AppInstallPermissions.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await AppInstallPermissions.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await AppInstallPermissions.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await AppInstallPermissions.list();
        await AppInstallPermissions.remove(entity_id!, "unit_test");
        const list = await AppInstallPermissions.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
