import { afterAll, describe, expect, it } from "vitest";
import { User } from "../src/services/user";
import { getRandom } from './utils';
import { createAndSaveCompany, removeCompany } from "./company.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let company;

export async function createAndSaveUser() {
    company = await createAndSaveCompany();
    // @ts-expect-error ignore error
    return User.create(getUserInstance());
}

export async function removeUser(id: number) {
    // run delete query to clean database
    await User.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeCompany(company.id);
}

function getUserInstance() {
    return {
        "first_name": getRandom('varchar', 255),
        "last_name": getRandom('varchar', 255),
        "title": getRandom('varchar', 255),
        "photo": getRandom('varchar', 255),
        "invite_status": getRandom('varchar', 100),
        "super_admin": getRandom('boolean'),
        "onboarding": getRandom('boolean'),
        "privacy_terms_last_accepted": getRandom('timestamptz'),
        "privacy_terms_version": getRandom('varchar', 100),
        "user_id": getRandom('varchar', 255),
        // @ts-expect-error ignore any type error
        "company_id": company.id,
    };
}

describe('User Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeUser(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveUser();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await User.update(
            entity_id!,
            { "first_name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await User.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await User.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await User.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await User.list();
        await User.remove(entity_id!, "unit_test");
        const list = await User.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
