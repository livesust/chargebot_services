import { afterAll, describe, expect, it } from "vitest";
import { ScheduledAlert } from "../src/services/scheduled_alert";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function createAndSaveScheduledAlert() {
    // @ts-expect-error ignore error
    return ScheduledAlert.create(getScheduledAlertInstance());
}

export async function removeScheduledAlert(id: number) {
    // run delete query to clean database
    await ScheduledAlert.hard_remove(id);
}

function getScheduledAlertInstance() {
    return {
        "name": getRandom('varchar', 255),
        "description": getRandom('text'),
        "alert_content": getRandom('text'),
    };
}

describe('ScheduledAlert Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeScheduledAlert(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveScheduledAlert();
        expect(response).toBeDefined();
        expect(response!.id).toBeTruthy();
        entity_id = response!.id;
    });

    it("Update", async () => {
        const response = await ScheduledAlert.update(
            entity_id!,
            { "name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await ScheduledAlert.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await ScheduledAlert.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await ScheduledAlert.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await ScheduledAlert.list();
        await ScheduledAlert.remove(entity_id!, "unit_test");
        const list = await ScheduledAlert.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
