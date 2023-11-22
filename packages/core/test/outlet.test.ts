import { expect, test } from "vitest";
import { Outlet } from "../src/services/outlet";
import { getRandom } from './utils';

let entity_id;

test("Create", async () => {
    const response = await Outlet.create({
        "pdu_outlet_number": getRandom('integer'),
        "notes": getRandom('text'),
    });
    expect(response).toBeDefined();
    expect(response!.id).toBeTruthy();
    entity_id = response!.id;
});

test("Update", async () => {
    const value = getRandom('integer');
    const response = await Outlet.update(
        entity_id!,
        { "pdu_outlet_number": value }
    );
    expect(response).toBeDefined();
    expect(response!.pdu_outlet_number).toEqual(value);
});

test("List", async () => {
    const response = await Outlet.list();
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
});

test("Get by ID", async () => {
    const response = await Outlet.get(entity_id!);
    expect(response).toBeTruthy();
    expect(response!.id).toEqual(entity_id!);
});

test("Search", async () => {
    const response: any[] = await Outlet.findByCriteria({
        "id": entity_id!
    });
    expect(response).toBeTruthy();
    expect(response).toHaveLength(1);
    expect(response[0].id).toEqual(entity_id!);
});

test("Delete", async () => {
    const response = await Outlet.list();
    await Outlet.remove(entity_id!, "unit_test");
    const list = await Outlet.list();

    expect(response).toBeTruthy();
    expect(list).toBeDefined();

    // force remove just to clean database
    await Outlet.hard_remove(entity_id!);
});