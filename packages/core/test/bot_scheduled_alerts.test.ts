import { expect, test } from "vitest";
import { BotScheduledAlerts } from "../src/services/bot_scheduled_alerts";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await BotScheduledAlerts.create({
        "alert_status": getRandom('boolean'),
        "settings": getRandom('json'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('boolean');
    const response = await BotScheduledAlerts.update(
        entity_id!,
        { "alert_status": value }
    );
    expect(response).toBeDefined();
    expect(response!.alert_status).toEqual(value);
});

test("List", async () => {
    const response = await BotScheduledAlerts.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await BotScheduledAlerts.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await BotScheduledAlerts.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await BotScheduledAlerts.list();
    await BotScheduledAlerts.remove(entity_id!, "unit_test");
    const list = await BotScheduledAlerts.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await BotScheduledAlerts.hard_remove(entity_id!);
});