import { afterAll, describe, expect, it } from "vitest";
import { UserPhone } from "../src/services/user_phone";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveUserPhone() {
    // @ts-expect-error ignore error
    return UserPhone.create(getUserPhoneInstance());
}

export async function removeUserPhone(id: number) {
    // run delete query to clean database
    await UserPhone.hard_remove(id);
}

function getUserPhoneInstance() {
    return {
        "phone_number": getRandom('text'),
        "send_text": getRandom('boolean'),
        "primary": getRandom('boolean'),
    };
}

describe('UserPhone Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeUserPhone(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveUserPhone();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await UserPhone.update(
            entity_id!,
            { "phone_number": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await UserPhone.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await UserPhone.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await UserPhone.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await UserPhone.list();
        await UserPhone.remove(entity_id!, "unit_test");
        const list = await UserPhone.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
