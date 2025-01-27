"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Trunking
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
exports.IpAccessControlListPage = exports.IpAccessControlListListInstance = exports.IpAccessControlListInstance = exports.IpAccessControlListContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
class IpAccessControlListContextImpl {
    constructor(_version, trunkSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(trunkSid)) {
            throw new Error("Parameter 'trunkSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { trunkSid, sid };
        this._uri = `/Trunks/${trunkSid}/IpAccessControlLists/${sid}`;
    }
    remove(callback) {
        const headers = {};
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.remove({
            uri: instance._uri,
            method: "delete",
            headers,
        });
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
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
        operationPromise = operationPromise.then((payload) => new IpAccessControlListInstance(operationVersion, payload, instance._solution.trunkSid, instance._solution.sid));
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
exports.IpAccessControlListContextImpl = IpAccessControlListContextImpl;
class IpAccessControlListInstance {
    constructor(_version, payload, trunkSid, sid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.sid = payload.sid;
        this.trunkSid = payload.trunk_sid;
        this.friendlyName = payload.friendly_name;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated);
        this.url = payload.url;
        this._solution = { trunkSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new IpAccessControlListContextImpl(this._version, this._solution.trunkSid, this._solution.sid);
        return this._context;
    }
    /**
     * Remove a IpAccessControlListInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed boolean
     */
    remove(callback) {
        return this._proxy.remove(callback);
    }
    /**
     * Fetch a IpAccessControlListInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed IpAccessControlListInstance
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
            accountSid: this.accountSid,
            sid: this.sid,
            trunkSid: this.trunkSid,
            friendlyName: this.friendlyName,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.IpAccessControlListInstance = IpAccessControlListInstance;
function IpAccessControlListListInstance(version, trunkSid) {
    if (!(0, utility_1.isValidPathParam)(trunkSid)) {
        throw new Error("Parameter 'trunkSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new IpAccessControlListContextImpl(version, trunkSid, sid);
    };
    instance._version = version;
    instance._solution = { trunkSid };
    instance._uri = `/Trunks/${trunkSid}/IpAccessControlLists`;
    instance.create = function create(params, callback) {
        if (params === null || params === undefined) {
            throw new Error('Required parameter "params" missing.');
        }
        if (params["ipAccessControlListSid"] === null ||
            params["ipAccessControlListSid"] === undefined) {
            throw new Error("Required parameter \"params['ipAccessControlListSid']\" missing.");
        }
        let data = {};
        data["IpAccessControlListSid"] = params["ipAccessControlListSid"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new IpAccessControlListInstance(operationVersion, payload, instance._solution.trunkSid));
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
    };
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
        operationPromise = operationPromise.then((payload) => new IpAccessControlListPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new IpAccessControlListPage(instance._version, payload, instance._solution));
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
exports.IpAccessControlListListInstance = IpAccessControlListListInstance;
class IpAccessControlListPage extends Page_1.default {
    /**
     * Initialize the IpAccessControlListPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of IpAccessControlListInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new IpAccessControlListInstance(this._version, payload, this._solution.trunkSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.IpAccessControlListPage = IpAccessControlListPage;
