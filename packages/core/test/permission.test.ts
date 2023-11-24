import { afterAll, describe, expect, it } from "vitest";
import { Permission } from "../src/services/permission";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSavePermission() {
    return Permission.create(getPermissionInstance());
}

export async function removePermission(id: number) {
    // run delete query to clean database
    await Permission.hard_remove(id);
}

function getPermissionInstance() {
    const instance = {
        "permission_name": getRandom('varchar', 255),
        "description": getRandom('text'),
    };
    console.log('Permission:', JSON.stringify(instance));
    return instance;
}

describe('Permission Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removePermission(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSavePermission();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await Permission.update(
            entity_id!,
            { "permission_name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Permission.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Permission.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Permission.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Permission.list();
        await Permission.remove(entity_id!, "unit_test");
        const list = await Permission.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
