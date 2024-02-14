import { afterAll, describe, expect, it } from "vitest";
import { Outlet } from "../src/services/outlet";
import { getRandom } from './utils';
import { getOrCreateOutletType } from "./outlet_type.test";
import { getOrCreateBot } from "./bot.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let outlet_type;
// @ts-expect-error ignore any type error
let bot;

export async function getOrCreateOutlet() {
    let outlet = await Outlet.findOneByCriteria({})
    if (!outlet) {
      // @ts-expect-error ignore error
      outlet = await createAndSaveOutlet();
    }
    return outlet;
}

export async function createAndSaveOutlet() {
    outlet_type = await getOrCreateOutletType();
    bot = await getOrCreateBot();
    // @ts-expect-error ignore error
    return Outlet.create(getOutletInstance());
}

export async function removeOutlet(id: number) {
    // run delete query to clean database
    await Outlet.hard_remove(id);
}

function getOutletInstance() {
    return {
        "pdu_outlet_number": getRandom('integer'),
        "notes": getRandom('text'),
        // @ts-expect-error ignore any type error
        "outlet_type_id": outlet_type.id,
        // @ts-expect-error ignore any type error
        "bot_id": bot.id,
    };
}

describe('Outlet Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeOutlet(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveOutlet();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await Outlet.update(
            entity_id!,
            { "pdu_outlet_number": getRandom('integer') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Outlet.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Outlet.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Outlet.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Outlet.list();
        await Outlet.remove(entity_id!, "unit_test");
        const list = await Outlet.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
