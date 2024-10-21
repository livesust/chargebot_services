import { afterAll, describe, expect, it } from "vitest";
import { BotModelComponent } from "../src/services/bot_model_component";
import { getRandom } from './utils';
import { createAndSaveBotModel, removeBotModel } from "./bot_model.test";
import { createAndSaveComponent, removeComponent } from "./component.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot_model;
// @ts-expect-error ignore any type error
let component;

export async function createAndSaveBotModelComponent() {
    bot_model = await createAndSaveBotModel();
    component = await createAndSaveComponent();
    // @ts-expect-error ignore error
    return BotModelComponent.create(getBotModelComponentInstance());
}

export async function removeBotModelComponent(id: number) {
    // run delete query to clean database
    await BotModelComponent.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeBotModel(bot_model.id);
    // @ts-expect-error ignore any type error
    await removeComponent(component.id);
}

function getBotModelComponentInstance() {
    return {
        "assignment_date": getRandom('timestamptz'),
        // @ts-expect-error ignore any type error
        "bot_model_id": bot_model.id,
        // @ts-expect-error ignore any type error
        "component_id": component.id,
    };
}

describe('BotModelComponent Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotModelComponent(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotModelComponent();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotModelComponent.update(
            entity_id!,
            { "assignment_date": getRandom('timestamptz') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotModelComponent.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotModelComponent.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotModelComponent.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotModelComponent.list();
        await BotModelComponent.remove(entity_id!, "unit_test");
        const list = await BotModelComponent.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
