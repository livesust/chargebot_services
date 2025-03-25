"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Wireless
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
exports.DataSessionPage = exports.DataSessionInstance = exports.DataSessionListInstance = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
function DataSessionListInstance(version, simSid) {
    if (!(0, utility_1.isValidPathParam)(simSid)) {
        throw new Error("Parameter 'simSid' is not valid.");
    }
    const instance = {};
    instance._version = version;
    instance._solution = { simSid };
    instance._uri = `/Sims/${simSid}/DataSessions`;
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
        operationPromise = operationPromise.then((payload) => new DataSessionPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new DataSessionPage(instance._version, payload, instance._solution));
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
exports.DataSessionListInstance = DataSessionListInstance;
class DataSessionInstance {
    constructor(_version, payload, simSid) {
        this._version = _version;
        this.sid = payload.sid;
        this.simSid = payload.sim_sid;
        this.accountSid = payload.account_sid;
        this.radioLink = payload.radio_link;
        this.operatorMcc = payload.operator_mcc;
        this.operatorMnc = payload.operator_mnc;
        this.operatorCountry = payload.operator_country;
        this.operatorName = payload.operator_name;
        this.cellId = payload.cell_id;
        this.cellLocationEstimate = payload.cell_location_estimate;
        this.packetsUploaded = deserialize.integer(payload.packets_uploaded);
        this.packetsDownloaded = deserialize.integer(payload.packets_downloaded);
        this.lastUpdated = deserialize.iso8601DateTime(payload.last_updated);
        this.start = deserialize.iso8601DateTime(payload.start);
        this.end = deserialize.iso8601DateTime(payload.end);
        this.imei = payload.imei;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            sid: this.sid,
            simSid: this.simSid,
            accountSid: this.accountSid,
            radioLink: this.radioLink,
            operatorMcc: this.operatorMcc,
            operatorMnc: this.operatorMnc,
            operatorCountry: this.operatorCountry,
            operatorName: this.operatorName,
            cellId: this.cellId,
            cellLocationEstimate: this.cellLocationEstimate,
            packetsUploaded: this.packetsUploaded,
            packetsDownloaded: this.packetsDownloaded,
            lastUpdated: this.lastUpdated,
            start: this.start,
            end: this.end,
            imei: this.imei,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.DataSessionInstance = DataSessionInstance;
class DataSessionPage extends Page_1.default {
    /**
     * Initialize the DataSessionPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of DataSessionInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new DataSessionInstance(this._version, payload, this._solution.simSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.DataSessionPage = DataSessionPage;
