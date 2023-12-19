import { afterAll, describe, expect, it } from "vitest";
import { Company } from "../src/services/company";
import { getRandom } from './utils';
import { createAndSaveCustomer, removeCustomer } from "./customer.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let customer;

export async function createAndSaveCompany() {
    customer = await createAndSaveCustomer();
    // @ts-expect-error ignore error
    return Company.create(getCompanyInstance());
}

export async function removeCompany(id: number) {
    // run delete query to clean database
    await Company.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeCustomer(customer.id);
}

function getCompanyInstance() {
    return {
        "name": getRandom('varchar', 255),
        "emergency_phone": getRandom('varchar', 255),
        "emergency_email": getRandom('varchar', 255),
        // @ts-expect-error ignore any type error
        "customer_id": customer.id,
    };
}

describe('Company Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeCompany(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveCompany();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await Company.update(
            entity_id!,
            { "name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Company.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Company.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Company.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Company.list();
        await Company.remove(entity_id!, "unit_test");
        const list = await Company.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
