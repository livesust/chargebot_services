import { afterAll, describe, expect, it } from "vitest";
import { AlertType } from "../src/services/alert_type";
import { getRandom } from './utils';


// @ts-expect-error ignore any type error
let entity_id;

export async function getOrCreateAlertType() {
    let alert_type = await AlertType.findOneByCriteria({})
    if (!alert_type) {
      // @ts-expect-error ignore error
      alert_type = await createAndSaveAlertType();
    }
    return alert_type;
}

export async function createAndSaveAlertType() {
    // @ts-expect-error ignore error
    return AlertType.create(getAlertTypeInstance());
}

export async function removeAlertType(id: number) {
    // run delete query to clean database
    await AlertType.hard_remove(id);
}

function getAlertTypeInstance() {
    return {
        "name": getRandom('varchar', 255),
        "description": getRandom('text'),
        "priority": getRandom('varchar', 255),
        "severity": getRandom('varchar', 255),
        "color_code": getRandom('varchar', 100),
        "send_push": getRandom('boolean'),
        "alert_text": getRandom('varchar', 255),
        "alert_link": getRandom('text'),
    };
}

describe('AlertType Tests', () => {

    afterAll(async () => {
        // @ts-expect-error ignore any type error
        await removeAlertType(entity_id);
    })

    it("Create", async () => {
        const response = await createAndSaveAlertType();
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toBeTruthy();
        entity_id = response!.entity!.id;
    });

    it("Update", async () => {
        const response = await AlertType.update(
            entity_id!,
            { "name": getRandom('varchar') }
        );
        expect(response).toBeDefined();
        expect(response!.entity).toBeDefined();
        expect(response!.entity!.id).toEqual(entity_id);
    });

    it("List", async () => {
        const response = await AlertType.list();
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(0);
    });

    it("Get by ID", async () => {
        const response = await AlertType.get(entity_id!);
        expect(response).toBeTruthy();
        expect(response!.id).toEqual(entity_id!);
    });

    it("Search", async () => {
        // @ts-expect-error ignore any type error
        const response: [] = await AlertType.findByCriteria({
            "id": entity_id!
        });
        expect(response).toBeTruthy();
        expect(response).toHaveLength(1);
        // @ts-expect-error ignore possible undefined
        expect(response[0].id).toEqual(entity_id!);
    });

    it("Delete", async () => {
        const response = await AlertType.list();
        await AlertType.remove(entity_id!, "unit_test");
        const list = await AlertType.list();

        expect(response).toBeTruthy();
        expect(list).toBeDefined();
    });
});
