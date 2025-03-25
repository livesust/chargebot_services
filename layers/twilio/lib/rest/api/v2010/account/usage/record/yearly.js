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
exports.YearlyPage = exports.YearlyInstance = exports.YearlyListInstance = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../../../base/Page"));
const deserialize = require("../../../../../../base/deserialize");
const serialize = require("../../../../../../base/serialize");
const utility_1 = require("../../../../../../base/utility");
function YearlyListInstance(version, accountSid) {
    if (!(0, utility_1.isValidPathParam)(accountSid)) {
        throw new Error("Parameter 'accountSid' is not valid.");
    }
    const instance = {};
    instance._version = version;
    instance._solution = { accountSid };
    instance._uri = `/Accounts/${accountSid}/Usage/Records/Yearly.json`;
    instance.page = function page(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["category"] !== undefined)
            data["Category"] = params["category"];
        if (params["startDate"] !== undefined)
            data["StartDate"] = serialize.iso8601Date(params["startDate"]);
        if (params["endDate"] !== undefined)
            data["EndDate"] = serialize.iso8601Date(params["endDate"]);
        if (params["includeSubaccounts"] !== undefined)
            data["IncludeSubaccounts"] = serialize.bool(params["includeSubaccounts"]);
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
        operationPromise = operationPromise.then((payload) => new YearlyPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new YearlyPage(instance._version, payload, instance._solution));
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
exports.YearlyListInstance = YearlyListInstance;
class YearlyInstance {
    constructor(_version, payload, accountSid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.apiVersion = payload.api_version;
        this.asOf = payload.as_of;
        this.category = payload.category;
        this.count = payload.count;
        this.countUnit = payload.count_unit;
        this.description = payload.description;
        this.endDate = deserialize.iso8601Date(payload.end_date);
        this.price = payload.price;
        this.priceUnit = payload.price_unit;
        this.startDate = deserialize.iso8601Date(payload.start_date);
        this.subresourceUris = payload.subresource_uris;
        this.uri = payload.uri;
        this.usage = payload.usage;
        this.usageUnit = payload.usage_unit;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            accountSid: this.accountSid,
            apiVersion: this.apiVersion,
            asOf: this.asOf,
            category: this.category,
            count: this.count,
            countUnit: this.countUnit,
            description: this.description,
            endDate: this.endDate,
            price: this.price,
            priceUnit: this.priceUnit,
            startDate: this.startDate,
            subresourceUris: this.subresourceUris,
            uri: this.uri,
            usage: this.usage,
            usageUnit: this.usageUnit,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.YearlyInstance = YearlyInstance;
class YearlyPage extends Page_1.default {
    /**
     * Initialize the YearlyPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of YearlyInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new YearlyInstance(this._version, payload, this._solution.accountSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.YearlyPage = YearlyPage;
