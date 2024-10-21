import { afterAll, describe, expect, it } from "vitest";
import { BotFirmwareVersion } from "../src/services/bot_firmware_version";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveBotFirmwareVersion() {
    // @ts-expect-error ignore error
    return BotFirmwareVersion.create(getBotFirmwareVersionInstance());
}

export async function removeBotFirmwareVersion(id: number) {
    // run delete query to clean database
    await BotFirmwareVersion.hard_remove(id);
}

function getBotFirmwareVersionInstance() {
    return {
        "version_number": getRandom('varchar', 255),
        "version_name": getRandom('varchar', 255),
        "notes": getRandom('text'),
        "active_date": getRandom('timestamptz'),
    };
}

describe('BotFirmwareVersion Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeBotFirmwareVersion(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveBotFirmwareVersion();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await BotFirmwareVersion.update(
            entity_id!,
            { "version_number": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await BotFirmwareVersion.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await BotFirmwareVersion.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await BotFirmwareVersion.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await BotFirmwareVersion.list();
        await BotFirmwareVersion.remove(entity_id!, "unit_test");
        const list = await BotFirmwareVersion.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
