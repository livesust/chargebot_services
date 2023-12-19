import { afterAll, describe, expect, it } from "vitest";
import { UserEmail } from "../src/services/user_email";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveUserEmail() {
    // @ts-expect-error ignore error
    return UserEmail.create(getUserEmailInstance());
}

export async function removeUserEmail(id: number) {
    // run delete query to clean database
    await UserEmail.hard_remove(id);
}

function getUserEmailInstance() {
    return {
        "email_address": getRandom('text'),
        "verified": getRandom('boolean'),
        "primary": getRandom('boolean'),
    };
}

describe('UserEmail Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeUserEmail(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveUserEmail();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await UserEmail.update(
            entity_id!,
            { "email_address": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await UserEmail.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await UserEmail.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await UserEmail.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await UserEmail.list();
        await UserEmail.remove(entity_id!, "unit_test");
        const list = await UserEmail.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
