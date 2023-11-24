import { afterAll, describe, expect, it } from "vitest";
import { Customer } from "../src/services/customer";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveCustomer() {
    // @ts-expect-error ignore error
    return Customer.create(getCustomerInstance());
}

export async function removeCustomer(id: number) {
    // run delete query to clean database
    await Customer.hard_remove(id);
}

function getCustomerInstance() {
    return {
        "name": getRandom('text'),
        "email": getRandom('text'),
        "first_order_date": getRandom('timestamptz'),
    };
}

describe('Customer Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeCustomer(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveCustomer();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await Customer.update(
            entity_id!,
            { "name": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Customer.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Customer.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Customer.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Customer.list();
        await Customer.remove(entity_id!, "unit_test");
        const list = await Customer.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
