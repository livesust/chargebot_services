import { afterAll, describe, expect, it } from "vitest";
import { BotFirmware } from "../src/services/bot_firmware";
import { getRandom } from './utils';
import { createAndSaveBot, removeBot } from "./bot.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot;

export async function createAndSaveBotFirmware() {
    bot = await createAndSaveBot();
    return BotFirmware.create(getBotFirmwareInstance());
}

export async function removeBotFirmware(id: number) {
    // run delete query to clean database
    await BotFirmware.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeBot(bot.id);
}

function getBotFirmwareInstance() {
    const instance = {
        "inverter_version": getRandom('varchar', 255),
        "pi_version": getRandom('varchar', 255),
        "firmware_version": getRandom('varchar', 255),
        "battery_version": getRandom('varchar', 255),
        "pdu_version": getRandom('varchar', 255),
        "notes": getRandom('text'),
        // @ts-expect-error ignore any type error
        "bot_id": bot.id,
    };
    console.log('BotFirmware:', JSON.stringify(instance));
    return instance;
}

describe('BotFirmware Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotFirmware(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotFirmware();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotFirmware.update(
            entity_id!,
            { "inverter_version": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotFirmware.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotFirmware.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotFirmware.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotFirmware.list();
        await BotFirmware.remove(entity_id!, "unit_test");
        const list = await BotFirmware.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
