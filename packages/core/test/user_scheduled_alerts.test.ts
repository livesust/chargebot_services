import { afterAll, describe, expect, it } from "vitest";
import { UserScheduledAlerts } from "../src/services/user_scheduled_alerts";
import { getRandom } from './utils';
import { createAndSaveScheduledAlert, removeScheduledAlert } from "./scheduled_alert.test";
import { createAndSaveUser, removeUser } from "./user.test";


// @ts-expect-error ignore any type error
let entity_id;
// @ts-expect-error ignore any type error
let scheduled_alert;
// @ts-expect-error ignore any type error
let user;

export async function createAndSaveUserScheduledAlerts() {
    scheduled_alert = await createAndSaveScheduledAlert();
    user = await createAndSaveUser();
    // @ts-expect-error ignore error
    return UserScheduledAlerts.create(getUserScheduledAlertsInstance());
}

export async function removeUserScheduledAlerts(id: number) {
    // run delete query to clean database
    await UserScheduledAlerts.hard_remove(id);
    // @ts-expect-error ignore any type error
    await removeScheduledAlert(scheduled_alert.id);
    // @ts-expect-error ignore any type error
    await removeUser(user.id);
}

function getUserScheduledAlertsInstance() {
    return {
        "alert_status": getRandom('boolean'),
        "settings": getRandom('json'),
        // @ts-expect-error ignore any type error
        "scheduled_alert_id": scheduled_alert.id,
        // @ts-expect-error ignore any type error
        "user_id": user.id,
    };
}

describe('UserScheduledAlerts Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeUserScheduledAlerts(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveUserScheduledAlerts();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await UserScheduledAlerts.update(
            entity_id!,
            { "alert_status": getRandom('boolean') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await UserScheduledAlerts.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await UserScheduledAlerts.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await UserScheduledAlerts.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await UserScheduledAlerts.list();
        await UserScheduledAlerts.remove(entity_id!, "unit_test");
        const list = await UserScheduledAlerts.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
