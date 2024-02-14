import { afterAll, describe, expect, it } from "vitest";
import { BotUser } from "../src/services/bot_user";
import { getRandom } from './utils';
import { getOrCreateBot } from "./bot.test";
import { getOrCreateUser } from "./user.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot;
// @ts-expect-error ignore any type error
let user;

export async function getOrCreateBotUser() {
    let bot_user = await BotUser.findOneByCriteria({})
    if (!bot_user) {
      // @ts-expect-error ignore error
      bot_user = await createAndSaveBotUser();
    }
    return bot_user;
}

export async function createAndSaveBotUser() {
    bot = await getOrCreateBot();
    user = await getOrCreateUser();
    // @ts-expect-error ignore error
    return BotUser.create(getBotUserInstance());
}

export async function removeBotUser(id: number) {
    // run delete query to clean database
    await BotUser.hard_remove(id);
}

function getBotUserInstance() {
    return {
        "assignment_date": getRandom('timestamptz'),
        // @ts-expect-error ignore any type error
        "bot_id": bot.id,
        // @ts-expect-error ignore any type error
        "user_id": user.id,
    };
}

describe('BotUser Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotUser(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotUser();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await BotUser.update(
            entity_id!,
            { "assignment_date": getRandom('timestamptz') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotUser.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotUser.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotUser.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotUser.list();
        await BotUser.remove(entity_id!, "unit_test");
        const list = await BotUser.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
