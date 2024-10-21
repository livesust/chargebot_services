import { afterAll, describe, expect, it } from "vitest";
import { BotFirmwareInstall } from "../src/services/bot_firmware_install";
import { getRandom } from './utils';
import { createAndSaveBot, removeBot } from "./bot.test";
import { createAndSaveBotFirmwareVersion, removeBotFirmwareVersion } from "./bot_firmware_version.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let bot;
// @ts-expect-error ignore any type error
let bot_firmware_version;

export async function createAndSaveBotFirmwareInstall() {
    bot = await createAndSaveBot();
    bot_firmware_version = await createAndSaveBotFirmwareVersion();
    // @ts-expect-error ignore error
    return BotFirmwareInstall.create(getBotFirmwareInstallInstance());
}

export async function removeBotFirmwareInstall(id: number) {
    // run delete query to clean database
    await BotFirmwareInstall.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeBot(bot.id);
    // @ts-expect-error ignore any type error
    await removeBotFirmwareVersion(bot_firmware_version.id);
}

function getBotFirmwareInstallInstance() {
    return {
        "install_date": getRandom('timestamptz'),
        "active": getRandom('boolean'),
        // @ts-expect-error ignore any type error
        "bot_id": bot.id,
        // @ts-expect-error ignore any type error
        "bot_firmware_version_id": bot_firmware_version.id,
    };
}

describe('BotFirmwareInstall Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotFirmwareInstall(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotFirmwareInstall();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotFirmwareInstall.update(
            entity_id!,
            { "install_date": getRandom('timestamptz') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotFirmwareInstall.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotFirmwareInstall.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotFirmwareInstall.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotFirmwareInstall.list();
        await BotFirmwareInstall.remove(entity_id!, "unit_test");
        const list = await BotFirmwareInstall.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
