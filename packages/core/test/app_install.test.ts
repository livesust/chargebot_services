import { expect, test } from "vitest";
import { AppInstall } from "../src/services/app_install";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await AppInstall.create({
        "app_version": getRandom('varchar', 255),
        "platform": getRandom('varchar', 100),
        "os_version": getRandom('varchar', 100),
        "description": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('varchar');
    const response = await AppInstall.update(
        entity_id!,
        { "app_version": value }
    );
    expect(response).toBeDefined();
    expect(response!.app_version).toEqual(value);
});

test("List", async () => {
    const response = await AppInstall.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await AppInstall.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await AppInstall.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await AppInstall.list();
    await AppInstall.remove(entity_id!, "unit_test");
    const list = await AppInstall.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await AppInstall.hard_remove(entity_id!);
});