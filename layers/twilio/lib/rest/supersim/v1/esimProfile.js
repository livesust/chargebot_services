"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Supersim
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
exports.EsimProfilePage = exports.EsimProfileListInstance = exports.EsimProfileInstance = exports.EsimProfileContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../base/Page"));
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
const utility_1 = require("../../../base/utility");
class EsimProfileContextImpl {
    constructor(_version, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { sid };
        this._uri = `/ESimProfiles/${sid}`;
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
        operationPromise = operationPromise.then((payload) => new EsimProfileInstance(operationVersion, payload, instance._solution.sid));
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
exports.EsimProfileContextImpl = EsimProfileContextImpl;
class EsimProfileInstance {
    constructor(_version, payload, sid) {
        this._version = _version;
        this.sid = payload.sid;
        this.accountSid = payload.account_sid;
        this.iccid = payload.iccid;
        this.simSid = payload.sim_sid;
        this.status = payload.status;
        this.eid = payload.eid;
        this.smdpPlusAddress = payload.smdp_plus_address;
        this.matchingId = payload.matching_id;
        this.activationCode = payload.activation_code;
        this.errorCode = payload.error_code;
        this.errorMessage = payload.error_message;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated);
        this.url = payload.url;
        this._solution = { sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new EsimProfileContextImpl(this._version, this._solution.sid);
        return this._context;
    }
    /**
     * Fetch a EsimProfileInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed EsimProfileInstance
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
            sid: this.sid,
            accountSid: this.accountSid,
            iccid: this.iccid,
            simSid: this.simSid,
            status: this.status,
            eid: this.eid,
            smdpPlusAddress: this.smdpPlusAddress,
            matchingId: this.matchingId,
            activationCode: this.activationCode,
            errorCode: this.errorCode,
            errorMessage: this.errorMessage,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.EsimProfileInstance = EsimProfileInstance;
function EsimProfileListInstance(version) {
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new EsimProfileContextImpl(version, sid);
    };
    instance._version = version;
    instance._solution = {};
    instance._uri = `/ESimProfiles`;
    instance.create = function create(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["callbackUrl"] !== undefined)
            data["CallbackUrl"] = params["callbackUrl"];
        if (params["callbackMethod"] !== undefined)
            data["CallbackMethod"] = params["callbackMethod"];
        if (params["generateMatchingId"] !== undefined)
            data["GenerateMatchingId"] = serialize.bool(params["generateMatchingId"]);
        if (params["eid"] !== undefined)
            data["Eid"] = params["eid"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new EsimProfileInstance(operationVersion, payload));
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
        if (params["eid"] !== undefined)
            data["Eid"] = params["eid"];
        if (params["simSid"] !== undefined)
            data["SimSid"] = params["simSid"];
        if (params["status"] !== undefined)
            data["Status"] = params["status"];
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
        operationPromise = operationPromise.then((payload) => new EsimProfilePage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new EsimProfilePage(instance._version, payload, instance._solution));
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
exports.EsimProfileListInstance = EsimProfileListInstance;
class EsimProfilePage extends Page_1.default {
    /**
     * Initialize the EsimProfilePage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of EsimProfileInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new EsimProfileInstance(this._version, payload);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.EsimProfilePage = EsimProfilePage;
