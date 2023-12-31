import { afterAll, describe, expect, it } from "vitest";
import { BotCompany } from "../src/services/bot_company";
import { getRandom } from './utils';
import { createAndSaveBot, removeBot } from "./bot.test";
import { createAndSaveCompany, removeCompany } from "./company.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot;
// @ts-expect-error ignore any type error
let company;

export async function createAndSaveBotCompany() {
    bot = await createAndSaveBot();
    company = await createAndSaveCompany();
    // @ts-expect-error ignore error
    return BotCompany.create(getBotCompanyInstance());
}

export async function removeBotCompany(id: number) {
    // run delete query to clean database
    await BotCompany.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeBot(bot.id);
    // @ts-expect-error ignore any type error
    await removeCompany(company.id);
}

function getBotCompanyInstance() {
    return {
        "acquire_date": getRandom('timestamptz'),
        // @ts-expect-error ignore any type error
        "bot_id": bot.id,
        // @ts-expect-error ignore any type error
        "company_id": company.id,
    };
}

describe('BotCompany Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotCompany(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotCompany();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotCompany.update(
            entity_id!,
            { "acquire_date": getRandom('timestamptz') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotCompany.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotCompany.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotCompany.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotCompany.list();
        await BotCompany.remove(entity_id!, "unit_test");
        const list = await BotCompany.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
