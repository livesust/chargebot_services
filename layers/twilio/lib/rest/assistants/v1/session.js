"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Assistants
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
exports.SessionPage = exports.SessionListInstance = exports.SessionInstance = exports.SessionContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../base/Page"));
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
const utility_1 = require("../../../base/utility");
const message_1 = require("./session/message");
class SessionContextImpl {
    constructor(_version, id) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(id)) {
            throw new Error("Parameter 'id' is not valid.");
        }
        this._solution = { id };
        this._uri = `/Sessions/${id}`;
    }
    get messages() {
        this._messages =
            this._messages || (0, message_1.MessageListInstance)(this._version, this._solution.id);
        return this._messages;
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
        operationPromise = operationPromise.then((payload) => new SessionInstance(operationVersion, payload, instance._solution.id));
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
exports.SessionContextImpl = SessionContextImpl;
class SessionInstance {
    constructor(_version, payload, id) {
        this._version = _version;
        this.id = payload.id;
        this.accountSid = payload.account_sid;
        this.assistantId = payload.assistant_id;
        this.verified = payload.verified;
        this.identity = payload.identity;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated);
        this._solution = { id: id || this.id };
    }
    get _proxy() {
        this._context =
            this._context || new SessionContextImpl(this._version, this._solution.id);
        return this._context;
    }
    /**
     * Fetch a SessionInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed SessionInstance
     */
    fetch(callback) {
        return this._proxy.fetch(callback);
    }
    /**
     * Access the messages.
     */
    messages() {
        return this._proxy.messages;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            id: this.id,
            accountSid: this.accountSid,
            assistantId: this.assistantId,
            verified: this.verified,
            identity: this.identity,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.SessionInstance = SessionInstance;
function SessionListInstance(version) {
    const instance = ((id) => instance.get(id));
    instance.get = function get(id) {
        return new SessionContextImpl(version, id);
    };
    instance._version = version;
    instance._solution = {};
    instance._uri = `/Sessions`;
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
        operationPromise = operationPromise.then((payload) => new SessionPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new SessionPage(instance._version, payload, instance._solution));
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
exports.SessionListInstance = SessionListInstance;
class SessionPage extends Page_1.default {
    /**
     * Initialize the SessionPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of SessionInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new SessionInstance(this._version, payload);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.SessionPage = SessionPage;
