import { afterAll, describe, expect, it } from "vitest";
import { StateMaster } from "../src/services/state_master";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function getOrCreateStateMaster() {
    let state_master = await StateMaster.findOneByCriteria({})
    if (!state_master) {
      // @ts-expect-error ignore error
      state_master = await createAndSaveStateMaster();
    }
    return state_master;
}

export async function createAndSaveStateMaster() {
    // @ts-expect-error ignore error
    return StateMaster.create(getStateMasterInstance());
}

export async function removeStateMaster(id: number) {
    // run delete query to clean database
    await StateMaster.hard_remove(id);
}

function getStateMasterInstance() {
    return {
        "name": getRandom('varchar', 100),
        "abbreviation": getRandom('varchar', 45),
        "country": getRandom('varchar', 255),
    };
}

describe('StateMaster Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeStateMaster(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveStateMaster();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await StateMaster.update(
            entity_id!,
            { "name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await StateMaster.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await StateMaster.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await StateMaster.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await StateMaster.list();
        await StateMaster.remove(entity_id!, "unit_test");
        const list = await StateMaster.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
