import { afterAll, describe, expect, it } from "vitest";
import { BotComponent } from "../src/services/bot_component";
import { getRandom } from './utils';
import { getOrCreateBot } from "./bot.test";
import { getOrCreateComponent } from "./component.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot;
// @ts-expect-error ignore any type error
let component;

export async function getOrCreateBotComponent() {
    let bot_component = await BotComponent.findOneByCriteria({})
    if (!bot_component) {
      // @ts-expect-error ignore error
      bot_component = await createAndSaveBotComponent();
    }
    return bot_component;
}

export async function createAndSaveBotComponent() {
    bot = await getOrCreateBot();
    component = await getOrCreateComponent();
    // @ts-expect-error ignore error
    return BotComponent.create(getBotComponentInstance());
}

export async function removeBotComponent(id: number) {
    // run delete query to clean database
    await BotComponent.hard_remove(id);
}

function getBotComponentInstance() {
    return {
        "install_date": getRandom('timestamptz'),
        "component_serial": getRandom('varchar', 255),
        // @ts-expect-error ignore any type error
        "bot_id": bot.id,
        // @ts-expect-error ignore any type error
        "component_id": component.id,
    };
}

describe('BotComponent Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotComponent(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotComponent();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await BotComponent.update(
            entity_id!,
            { "install_date": getRandom('timestamptz') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotComponent.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotComponent.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotComponent.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotComponent.list();
        await BotComponent.remove(entity_id!, "unit_test");
        const list = await BotComponent.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
