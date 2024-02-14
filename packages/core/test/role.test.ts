import { afterAll, describe, expect, it } from "vitest";
import { Role } from "../src/services/role";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function getOrCreateRole() {
    let role = await Role.findOneByCriteria({})
    if (!role) {
      // @ts-expect-error ignore error
      role = await createAndSaveRole();
    }
    return role;
}

export async function createAndSaveRole() {
    // @ts-expect-error ignore error
    return Role.create(getRoleInstance());
}

export async function removeRole(id: number) {
    // run delete query to clean database
    await Role.hard_remove(id);
}

function getRoleInstance() {
    return {
        "role": getRandom('varchar', 255),
        "description": getRandom('text'),
    };
}

describe('Role Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeRole(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveRole();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await Role.update(
            entity_id!,
            { "role": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Role.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Role.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Role.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Role.list();
        await Role.remove(entity_id!, "unit_test");
        const list = await Role.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
