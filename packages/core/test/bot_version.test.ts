import { afterAll, describe, expect, it } from "vitest";
import { BotVersion } from "../src/services/bot_version";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function getOrCreateBotVersion() {
    let bot_version = await BotVersion.findOneByCriteria({})
    if (!bot_version) {
      // @ts-expect-error ignore error
      bot_version = await createAndSaveBotVersion();
    }
    return bot_version;
}

export async function createAndSaveBotVersion() {
    // @ts-expect-error ignore error
    return BotVersion.create(getBotVersionInstance());
}

export async function removeBotVersion(id: number) {
    // run delete query to clean database
    await BotVersion.hard_remove(id);
}

function getBotVersionInstance() {
    return {
        "version_number": getRandom('varchar', 255),
        "version_name": getRandom('varchar', 255),
        "notes": getRandom('text'),
        "active_date": getRandom('timestamptz'),
    };
}

describe('BotVersion Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotVersion(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotVersion();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await BotVersion.update(
            entity_id!,
            { "version_number": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotVersion.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotVersion.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotVersion.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotVersion.list();
        await BotVersion.remove(entity_id!, "unit_test");
        const list = await BotVersion.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
