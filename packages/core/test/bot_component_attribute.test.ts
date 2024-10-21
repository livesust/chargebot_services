import { afterAll, describe, expect, it } from "vitest";
import { BotComponentAttribute } from "../src/services/bot_component_attribute";
import { getRandom } from './utils';
import { createAndSaveBot, removeBot } from "./bot.test";
import { createAndSaveComponentAttribute, removeComponentAttribute } from "./component_attribute.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot;
// @ts-expect-error ignore any type error
let component_attribute;

export async function createAndSaveBotComponentAttribute() {
    bot = await createAndSaveBot();
    component_attribute = await createAndSaveComponentAttribute();
    // @ts-expect-error ignore error
    return BotComponentAttribute.create(getBotComponentAttributeInstance());
}

export async function removeBotComponentAttribute(id: number) {
    // run delete query to clean database
    await BotComponentAttribute.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeBot(bot.id);
    // @ts-expect-error ignore any type error
    await removeComponentAttribute(component_attribute.id);
}

function getBotComponentAttributeInstance() {
    return {
        "value": getRandom('text'),
        // @ts-expect-error ignore any type error
        "bot_id": bot.id,
        // @ts-expect-error ignore any type error
        "component_attribute_id": component_attribute.id,
    };
}

describe('BotComponentAttribute Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotComponentAttribute(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotComponentAttribute();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotComponentAttribute.update(
            entity_id!,
            { "value": getRandom('text') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotComponentAttribute.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotComponentAttribute.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotComponentAttribute.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotComponentAttribute.list();
        await BotComponentAttribute.remove(entity_id!, "unit_test");
        const list = await BotComponentAttribute.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
