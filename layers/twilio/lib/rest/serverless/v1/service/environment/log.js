"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Serverless
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
exports.LogPage = exports.LogListInstance = exports.LogInstance = exports.LogContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../../base/Page"));
const deserialize = require("../../../../../base/deserialize");
const serialize = require("../../../../../base/serialize");
const utility_1 = require("../../../../../base/utility");
class LogContextImpl {
    constructor(_version, serviceSid, environmentSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(serviceSid)) {
            throw new Error("Parameter 'serviceSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(environmentSid)) {
            throw new Error("Parameter 'environmentSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { serviceSid, environmentSid, sid };
        this._uri = `/Services/${serviceSid}/Environments/${environmentSid}/Logs/${sid}`;
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
        operationPromise = operationPromise.then((payload) => new LogInstance(operationVersion, payload, instance._solution.serviceSid, instance._solution.environmentSid, instance._solution.sid));
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
exports.LogContextImpl = LogContextImpl;
class LogInstance {
    constructor(_version, payload, serviceSid, environmentSid, sid) {
        this._version = _version;
        this.sid = payload.sid;
        this.accountSid = payload.account_sid;
        this.serviceSid = payload.service_sid;
        this.environmentSid = payload.environment_sid;
        this.buildSid = payload.build_sid;
        this.deploymentSid = payload.deployment_sid;
        this.functionSid = payload.function_sid;
        this.requestSid = payload.request_sid;
        this.level = payload.level;
        this.message = payload.message;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.url = payload.url;
        this._solution = { serviceSid, environmentSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new LogContextImpl(this._version, this._solution.serviceSid, this._solution.environmentSid, this._solution.sid);
        return this._context;
    }
    /**
     * Fetch a LogInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed LogInstance
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
            serviceSid: this.serviceSid,
            environmentSid: this.environmentSid,
            buildSid: this.buildSid,
            deploymentSid: this.deploymentSid,
            functionSid: this.functionSid,
            requestSid: this.requestSid,
            level: this.level,
            message: this.message,
            dateCreated: this.dateCreated,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.LogInstance = LogInstance;
function LogListInstance(version, serviceSid, environmentSid) {
    if (!(0, utility_1.isValidPathParam)(serviceSid)) {
        throw new Error("Parameter 'serviceSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(environmentSid)) {
        throw new Error("Parameter 'environmentSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new LogContextImpl(version, serviceSid, environmentSid, sid);
    };
    instance._version = version;
    instance._solution = { serviceSid, environmentSid };
    instance._uri = `/Services/${serviceSid}/Environments/${environmentSid}/Logs`;
    instance.page = function page(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["functionSid"] !== undefined)
            data["FunctionSid"] = params["functionSid"];
        if (params["startDate"] !== undefined)
            data["StartDate"] = serialize.iso8601DateTime(params["startDate"]);
        if (params["endDate"] !== undefined)
            data["EndDate"] = serialize.iso8601DateTime(params["endDate"]);
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
        operationPromise = operationPromise.then((payload) => new LogPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new LogPage(instance._version, payload, instance._solution));
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
exports.LogListInstance = LogListInstance;
class LogPage extends Page_1.default {
    /**
     * Initialize the LogPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of LogInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new LogInstance(this._version, payload, this._solution.serviceSid, this._solution.environmentSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.LogPage = LogPage;
