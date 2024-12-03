import { afterAll, describe, expect, it } from "vitest";
import { BotStatus } from "../src/services/bot_status";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveBotStatus() {
    // @ts-expect-error ignore error
    return BotStatus.create(getBotStatusInstance());
}

export async function removeBotStatus(id: number) {
    // run delete query to clean database
    await BotStatus.hard_remove(id);
}

function getBotStatusInstance() {
    return {
        "name": getRandom('text'),
        "display_on_dashboard": getRandom('boolean'),
    };
}

describe('BotStatus Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotStatus(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotStatus();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotStatus.update(
            entity_id!,
            { "name": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotStatus.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotStatus.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotStatus.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotStatus.list();
        await BotStatus.remove(entity_id!, "unit_test");
        const list = await BotStatus.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
