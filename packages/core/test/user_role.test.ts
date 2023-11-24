import { afterAll, describe, expect, it } from "vitest";
import { UserRole } from "../src/services/user_role";
import { getRandom } from './utils';
import { createAndSaveUser, removeUser } from "./user.test";
import { createAndSaveRole, removeRole } from "./role.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let user;
// @ts-expect-error ignore any type error
let role;

export async function createAndSaveUserRole() {
    user = await createAndSaveUser();
    role = await createAndSaveRole();
    // @ts-expect-error ignore error
    return UserRole.create(getUserRoleInstance());
}

export async function removeUserRole(id: number) {
    // run delete query to clean database
    await UserRole.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeUser(user.id);
    // @ts-expect-error ignore any type error
    await removeRole(role.id);
}

function getUserRoleInstance() {
    return {
        "all_bots": getRandom('boolean'),
        // @ts-expect-error ignore any type error
        "user_id": user.id,
        // @ts-expect-error ignore any type error
        "role_id": role.id,
    };
}

describe('UserRole Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeUserRole(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveUserRole();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await UserRole.update(
            entity_id!,
            { "all_bots": getRandom('boolean') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await UserRole.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await UserRole.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await UserRole.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await UserRole.list();
        await UserRole.remove(entity_id!, "unit_test");
        const list = await UserRole.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
