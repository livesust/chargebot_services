import { afterAll, describe, expect, it } from "vitest";
import { HomeMaster } from "../src/services/home_master";
import { getRandom } from './utils';
import { getOrCreateStateMaster } from "./state_master.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let state_master;

export async function getOrCreateHomeMaster() {
    let home_master = await HomeMaster.findOneByCriteria({})
    if (!home_master) {
      // @ts-expect-error ignore error
      home_master = await createAndSaveHomeMaster();
    }
    return home_master;
}

export async function createAndSaveHomeMaster() {
    state_master = await getOrCreateStateMaster();
    // @ts-expect-error ignore error
    return HomeMaster.create(getHomeMasterInstance());
}

export async function removeHomeMaster(id: number) {
    // run delete query to clean database
    await HomeMaster.hard_remove(id);
}

function getHomeMasterInstance() {
    return {
        "address_line_1": getRandom('text'),
        "address_line_2": getRandom('text'),
        "city": getRandom('varchar', 100),
        "zip_code": getRandom('varchar', 100),
        "latitude": getRandom('float'),
        "longitude": getRandom('float'),
        // @ts-expect-error ignore any type error
        "state_master_id": state_master.id,
    };
}

describe('HomeMaster Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeHomeMaster(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveHomeMaster();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await HomeMaster.update(
            entity_id!,
            { "address_line_1": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await HomeMaster.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await HomeMaster.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await HomeMaster.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await HomeMaster.list();
        await HomeMaster.remove(entity_id!, "unit_test");
        const list = await HomeMaster.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
