import { expect, test } from "vitest";
import { BotAlert } from "../src/services/bot_alert";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await BotAlert.create({
        "message_displayed": getRandom('text'),
        "push_sent": getRandom('boolean'),
        "send_time": getRandom('timestampz'),
        "display_time": getRandom('timestampz'),
        "show": getRandom('boolean'),
        "dismissed": getRandom('boolean'),
        "active": getRandom('boolean'),
        "alert_count": getRandom('integer'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('text');
    const response = await BotAlert.update(
        entity_id!,
        { "message_displayed": value }
    );
    expect(response).toBeDefined();
    expect(response!.message_displayed).toEqual(value);
});

test("List", async () => {
    const response = await BotAlert.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await BotAlert.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await BotAlert.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await BotAlert.list();
    await BotAlert.remove(entity_id!, "unit_test");
    const list = await BotAlert.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await BotAlert.hard_remove(entity_id!);
});