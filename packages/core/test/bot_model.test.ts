import { afterAll, describe, expect, it } from "vitest";
import { BotModel } from "../src/services/bot_model";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveBotModel() {
    // @ts-expect-error ignore error
    return BotModel.create(getBotModelInstance());
}

export async function removeBotModel(id: number) {
    // run delete query to clean database
    await BotModel.hard_remove(id);
}

function getBotModelInstance() {
    return {
        "name": getRandom('varchar', 255),
        "version": getRandom('varchar', 255),
        "release_date": getRandom('timestamptz'),
    };
}

describe('BotModel Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotModel(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotModel();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotModel.update(
            entity_id!,
            { "name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotModel.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotModel.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotModel.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotModel.list();
        await BotModel.remove(entity_id!, "unit_test");
        const list = await BotModel.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
