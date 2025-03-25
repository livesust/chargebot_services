"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Events
 * This is the public Twilio REST API.
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaVersionPage = exports.SchemaVersionListInstance = exports.SchemaVersionInstance = exports.SchemaVersionContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
class SchemaVersionContextImpl {
    constructor(_version, id, schemaVersion) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(id)) {
            throw new Error("Parameter 'id' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(schemaVersion)) {
            throw new Error("Parameter 'schemaVersion' is not valid.");
        }
        this._solution = { id, schemaVersion };
        this._uri = `/Schemas/${id}/Versions/${schemaVersion}`;
    }
    fetch(callback) {
        const headers = {};
        headers["Accept"] = "application/json";
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.fetch({
            uri: instance._uri,
            method: "get",
            headers,
        });
        operationPromise = operationPromise.then((payload) => new SchemaVersionInstance(operationVersion, payload, instance._solution.id, instance._solution.schemaVersion));
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return this._solution;
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.SchemaVersionContextImpl = SchemaVersionContextImpl;
class SchemaVersionInstance {
    constructor(_version, payload, id, schemaVersion) {
        this._version = _version;
        this.id = payload.id;
        this.schemaVersion = deserialize.integer(payload.schema_version);
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.url = payload.url;
        this.raw = payload.raw;
        this._solution = { id, schemaVersion: schemaVersion || this.schemaVersion };
    }
    get _proxy() {
        this._context =
            this._context ||
                new SchemaVersionContextImpl(this._version, this._solution.id, this._solution.schemaVersion);
        return this._context;
    }
    /**
     * Fetch a SchemaVersionInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed SchemaVersionInstance
     */
    fetch(callback) {
        return this._proxy.fetch(callback);
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            id: this.id,
            schemaVersion: this.schemaVersion,
            dateCreated: this.dateCreated,
            url: this.url,
            raw: this.raw,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.SchemaVersionInstance = SchemaVersionInstance;
function SchemaVersionListInstance(version, id) {
    if (!(0, utility_1.isValidPathParam)(id)) {
        throw new Error("Parameter 'id' is not valid.");
    }
    const instance = ((schemaVersion) => instance.get(schemaVersion));
    instance.get = function get(schemaVersion) {
        return new SchemaVersionContextImpl(version, id, schemaVersion);
    };
    instance._version = version;
    instance._solution = { id };
    instance._uri = `/Schemas/${id}/Versions`;
    instance.page = function page(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["pageSize"] !== undefined)
            data["PageSize"] = params["pageSize"];
        if (params.pageNumber !== undefined)
            data["Page"] = params.pageNumber;
        if (params.pageToken !== undefined)
            data["PageToken"] = params.pageToken;
        const headers = {};
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.page({
            uri: instance._uri,
            method: "get",
            params: data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new SchemaVersionPage(operationVersion, payload, instance._solution));
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
    };
    instance.each = instance._version.each;
    instance.list = instance._version.list;
    instance.getPage = function getPage(targetUrl, callback) {
        const operationPromise = instance._version._domain.twilio.request({
            method: "get",
            uri: targetUrl,
        });
        let pagePromise = operationPromise.then((payload) => new SchemaVersionPage(instance._version, payload, instance._solution));
        pagePromise = instance._version.setPromiseCallback(pagePromise, callback);
        return pagePromise;
    };
    instance.toJSON = function toJSON() {
        return instance._solution;
    };
    instance[util_1.inspect.custom] = function inspectImpl(_depth, options) {
        return (0, util_1.inspect)(instance.toJSON(), options);
    };
    return instance;
}
exports.SchemaVersionListInstance = SchemaVersionListInstance;
class SchemaVersionPage extends Page_1.default {
    /**
     * Initialize the SchemaVersionPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of SchemaVersionInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new SchemaVersionInstance(this._version, payload, this._solution.id);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.SchemaVersionPage = SchemaVersionPage;
