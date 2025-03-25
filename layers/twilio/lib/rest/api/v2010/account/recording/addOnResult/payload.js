"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Api
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
exports.PayloadPage = exports.PayloadListInstance = exports.PayloadInstance = exports.PayloadContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../../../base/Page"));
const deserialize = require("../../../../../../base/deserialize");
const serialize = require("../../../../../../base/serialize");
const utility_1 = require("../../../../../../base/utility");
const data_1 = require("./payload/data");
class PayloadContextImpl {
    constructor(_version, accountSid, referenceSid, addOnResultSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(accountSid)) {
            throw new Error("Parameter 'accountSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(referenceSid)) {
            throw new Error("Parameter 'referenceSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(addOnResultSid)) {
            throw new Error("Parameter 'addOnResultSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { accountSid, referenceSid, addOnResultSid, sid };
        this._uri = `/Accounts/${accountSid}/Recordings/${referenceSid}/AddOnResults/${addOnResultSid}/Payloads/${sid}.json`;
    }
    get data() {
        this._data =
            this._data ||
                (0, data_1.DataListInstance)(this._version, this._solution.accountSid, this._solution.referenceSid, this._solution.addOnResultSid, this._solution.sid);
        return this._data;
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
        operationPromise = operationPromise.then((payload) => new PayloadInstance(operationVersion, payload, instance._solution.accountSid, instance._solution.referenceSid, instance._solution.addOnResultSid, instance._solution.sid));
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
exports.PayloadContextImpl = PayloadContextImpl;
class PayloadInstance {
    constructor(_version, payload, accountSid, referenceSid, addOnResultSid, sid) {
        this._version = _version;
        this.sid = payload.sid;
        this.addOnResultSid = payload.add_on_result_sid;
        this.accountSid = payload.account_sid;
        this.label = payload.label;
        this.addOnSid = payload.add_on_sid;
        this.addOnConfigurationSid = payload.add_on_configuration_sid;
        this.contentType = payload.content_type;
        this.dateCreated = deserialize.rfc2822DateTime(payload.date_created);
        this.dateUpdated = deserialize.rfc2822DateTime(payload.date_updated);
        this.referenceSid = payload.reference_sid;
        this.subresourceUris = payload.subresource_uris;
        this._solution = {
            accountSid,
            referenceSid,
            addOnResultSid,
            sid: sid || this.sid,
        };
    }
    get _proxy() {
        this._context =
            this._context ||
                new PayloadContextImpl(this._version, this._solution.accountSid, this._solution.referenceSid, this._solution.addOnResultSid, this._solution.sid);
        return this._context;
    }
    /**
     * Remove a PayloadInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed boolean
     */
    remove(callback) {
        return this._proxy.remove(callback);
    }
    /**
     * Fetch a PayloadInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed PayloadInstance
     */
    fetch(callback) {
        return this._proxy.fetch(callback);
    }
    /**
     * Access the data.
     */
    data() {
        return this._proxy.data;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            sid: this.sid,
            addOnResultSid: this.addOnResultSid,
            accountSid: this.accountSid,
            label: this.label,
            addOnSid: this.addOnSid,
            addOnConfigurationSid: this.addOnConfigurationSid,
            contentType: this.contentType,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
            referenceSid: this.referenceSid,
            subresourceUris: this.subresourceUris,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.PayloadInstance = PayloadInstance;
function PayloadListInstance(version, accountSid, referenceSid, addOnResultSid) {
    if (!(0, utility_1.isValidPathParam)(accountSid)) {
        throw new Error("Parameter 'accountSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(referenceSid)) {
        throw new Error("Parameter 'referenceSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(addOnResultSid)) {
        throw new Error("Parameter 'addOnResultSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new PayloadContextImpl(version, accountSid, referenceSid, addOnResultSid, sid);
    };
    instance._version = version;
    instance._solution = { accountSid, referenceSid, addOnResultSid };
    instance._uri = `/Accounts/${accountSid}/Recordings/${referenceSid}/AddOnResults/${addOnResultSid}/Payloads.json`;
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
        operationPromise = operationPromise.then((payload) => new PayloadPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new PayloadPage(instance._version, payload, instance._solution));
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
exports.PayloadListInstance = PayloadListInstance;
class PayloadPage extends Page_1.default {
    /**
     * Initialize the PayloadPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of PayloadInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new PayloadInstance(this._version, payload, this._solution.accountSid, this._solution.referenceSid, this._solution.addOnResultSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.PayloadPage = PayloadPage;
