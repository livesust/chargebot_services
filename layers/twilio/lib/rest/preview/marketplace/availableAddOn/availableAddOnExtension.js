"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Preview
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
exports.AvailableAddOnExtensionPage = exports.AvailableAddOnExtensionListInstance = exports.AvailableAddOnExtensionInstance = exports.AvailableAddOnExtensionContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
class AvailableAddOnExtensionContextImpl {
    constructor(_version, availableAddOnSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(availableAddOnSid)) {
            throw new Error("Parameter 'availableAddOnSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { availableAddOnSid, sid };
        this._uri = `/AvailableAddOns/${availableAddOnSid}/Extensions/${sid}`;
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
        operationPromise = operationPromise.then((payload) => new AvailableAddOnExtensionInstance(operationVersion, payload, instance._solution.availableAddOnSid, instance._solution.sid));
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
exports.AvailableAddOnExtensionContextImpl = AvailableAddOnExtensionContextImpl;
class AvailableAddOnExtensionInstance {
    constructor(_version, payload, availableAddOnSid, sid) {
        this._version = _version;
        this.sid = payload.sid;
        this.availableAddOnSid = payload.available_add_on_sid;
        this.friendlyName = payload.friendly_name;
        this.productName = payload.product_name;
        this.uniqueName = payload.unique_name;
        this.url = payload.url;
        this._solution = { availableAddOnSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new AvailableAddOnExtensionContextImpl(this._version, this._solution.availableAddOnSid, this._solution.sid);
        return this._context;
    }
    /**
     * Fetch a AvailableAddOnExtensionInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed AvailableAddOnExtensionInstance
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
            availableAddOnSid: this.availableAddOnSid,
            friendlyName: this.friendlyName,
            productName: this.productName,
            uniqueName: this.uniqueName,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.AvailableAddOnExtensionInstance = AvailableAddOnExtensionInstance;
function AvailableAddOnExtensionListInstance(version, availableAddOnSid) {
    if (!(0, utility_1.isValidPathParam)(availableAddOnSid)) {
        throw new Error("Parameter 'availableAddOnSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new AvailableAddOnExtensionContextImpl(version, availableAddOnSid, sid);
    };
    instance._version = version;
    instance._solution = { availableAddOnSid };
    instance._uri = `/AvailableAddOns/${availableAddOnSid}/Extensions`;
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
        operationPromise = operationPromise.then((payload) => new AvailableAddOnExtensionPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new AvailableAddOnExtensionPage(instance._version, payload, instance._solution));
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
exports.AvailableAddOnExtensionListInstance = AvailableAddOnExtensionListInstance;
class AvailableAddOnExtensionPage extends Page_1.default {
    /**
     * Initialize the AvailableAddOnExtensionPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of AvailableAddOnExtensionInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new AvailableAddOnExtensionInstance(this._version, payload, this._solution.availableAddOnSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.AvailableAddOnExtensionPage = AvailableAddOnExtensionPage;
