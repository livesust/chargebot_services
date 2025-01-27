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
exports.IpCommandPage = exports.IpCommandListInstance = exports.IpCommandInstance = exports.IpCommandContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../base/Page"));
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
const utility_1 = require("../../../base/utility");
class IpCommandContextImpl {
    constructor(_version, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { sid };
        this._uri = `/IpCommands/${sid}`;
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
        operationPromise = operationPromise.then((payload) => new IpCommandInstance(operationVersion, payload, instance._solution.sid));
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
exports.IpCommandContextImpl = IpCommandContextImpl;
class IpCommandInstance {
    constructor(_version, payload, sid) {
        this._version = _version;
        this.sid = payload.sid;
        this.accountSid = payload.account_sid;
        this.simSid = payload.sim_sid;
        this.simIccid = payload.sim_iccid;
        this.status = payload.status;
        this.direction = payload.direction;
        this.deviceIp = payload.device_ip;
        this.devicePort = deserialize.integer(payload.device_port);
        this.payloadType = payload.payload_type;
        this.payload = payload.payload;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated);
        this.url = payload.url;
        this._solution = { sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new IpCommandContextImpl(this._version, this._solution.sid);
        return this._context;
    }
    /**
     * Fetch a IpCommandInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed IpCommandInstance
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
            simSid: this.simSid,
            simIccid: this.simIccid,
            status: this.status,
            direction: this.direction,
            deviceIp: this.deviceIp,
            devicePort: this.devicePort,
            payloadType: this.payloadType,
            payload: this.payload,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.IpCommandInstance = IpCommandInstance;
function IpCommandListInstance(version) {
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new IpCommandContextImpl(version, sid);
    };
    instance._version = version;
    instance._solution = {};
    instance._uri = `/IpCommands`;
    instance.create = function create(params, callback) {
        if (params === null || params === undefined) {
            throw new Error('Required parameter "params" missing.');
        }
        if (params["sim"] === null || params["sim"] === undefined) {
            throw new Error("Required parameter \"params['sim']\" missing.");
        }
        if (params["payload"] === null || params["payload"] === undefined) {
            throw new Error("Required parameter \"params['payload']\" missing.");
        }
        if (params["devicePort"] === null || params["devicePort"] === undefined) {
            throw new Error("Required parameter \"params['devicePort']\" missing.");
        }
        let data = {};
        data["Sim"] = params["sim"];
        data["Payload"] = params["payload"];
        data["DevicePort"] = params["devicePort"];
        if (params["payloadType"] !== undefined)
            data["PayloadType"] = params["payloadType"];
        if (params["callbackUrl"] !== undefined)
            data["CallbackUrl"] = params["callbackUrl"];
        if (params["callbackMethod"] !== undefined)
            data["CallbackMethod"] = params["callbackMethod"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new IpCommandInstance(operationVersion, payload));
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
        if (params["sim"] !== undefined)
            data["Sim"] = params["sim"];
        if (params["simIccid"] !== undefined)
            data["SimIccid"] = params["simIccid"];
        if (params["status"] !== undefined)
            data["Status"] = params["status"];
        if (params["direction"] !== undefined)
            data["Direction"] = params["direction"];
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
        operationPromise = operationPromise.then((payload) => new IpCommandPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new IpCommandPage(instance._version, payload, instance._solution));
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
exports.IpCommandListInstance = IpCommandListInstance;
class IpCommandPage extends Page_1.default {
    /**
     * Initialize the IpCommandPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of IpCommandInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new IpCommandInstance(this._version, payload);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.IpCommandPage = IpCommandPage;
