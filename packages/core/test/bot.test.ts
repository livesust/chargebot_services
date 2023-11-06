import { expect, test } from "vitest";
import { v4 as uuidv4 } from 'uuid';
import { Bot } from "../src/bot";

const bot_uuid = uuidv4();
let entity_id;

test("Create", async () => {
    const response = await Bot.create({
        "bot_uuid": bot_uuid,
        "name": "Bot " + bot_uuid,
        "initials": "TB",
        "pin_color": "red"
    }, "unit test");
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Create Error", async () => {
    await expect(
        Bot.create({
            "bot_uuid": bot_uuid,
            "name": "Bot Fail",
            "initials": "BF",
            "pin_color": "red"
        }, "unit test")
    ).rejects.toThrow('violates unique constraint');
});

test("Update", async () => {
    const response = await Bot.update(
        entity_id!,
        { "name": "Updated" },
        "unit test"
    );
    expect(response).toBeDefined();
    expect(response!.name).toEqual("Updated");
});

test("List", async () => {
    const response = await Bot.list();
    expect(response).toBeDefined();
});

test("Get by ID", async () => {
    const response = await Bot.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Get by UUID", async () => {
    const response = await Bot.get_by_uuid(bot_uuid);
    expect(response).toBeTruthy();
    expect(response!.bot_uuid).toEqual(bot_uuid);
});

test("Delete", async () => {
    const response = await Bot.list();
    await Bot.remove(entity_id!, "unit test");
    const list = await Bot.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();
});