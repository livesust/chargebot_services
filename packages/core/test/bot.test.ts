import { afterAll, describe, expect, it } from "vitest";
import { Bot } from "../src/services/bot";
import { getRandom } from './utils';
import { getOrCreateBotVersion } from "./bot_version.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot_version;

export async function getOrCreateBot() {
    let bot = await Bot.findOneByCriteria({})
    if (!bot) {
      // @ts-expect-error ignore error
      bot = await createAndSaveBot();
    }
    return bot;
}

export async function createAndSaveBot() {
    bot_version = await getOrCreateBotVersion();
    // @ts-expect-error ignore error
    return Bot.create(getBotInstance());
}

export async function removeBot(id: number) {
    // run delete query to clean database
    await Bot.hard_remove(id);
}

function getBotInstance() {
    return {
        "bot_uuid": getRandom('text'),
        "initials": getRandom('varchar', 2),
        "name": getRandom('varchar', 255),
        "pin_color": getRandom('varchar', 100),
        // @ts-expect-error ignore any type error
        "bot_version_id": bot_version.id,
    };
}

describe('Bot Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBot(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBot();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await Bot.update(
            entity_id!,
            { "bot_uuid": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await Bot.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await Bot.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await Bot.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await Bot.list();
        await Bot.remove(entity_id!, "unit_test");
        const list = await Bot.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
