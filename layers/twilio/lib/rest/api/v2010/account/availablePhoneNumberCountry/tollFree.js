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
exports.TollFreePage = exports.TollFreeInstance = exports.TollFreeListInstance = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../../base/Page"));
const deserialize = require("../../../../../base/deserialize");
const serialize = require("../../../../../base/serialize");
const utility_1 = require("../../../../../base/utility");
function TollFreeListInstance(version, accountSid, countryCode) {
    if (!(0, utility_1.isValidPathParam)(accountSid)) {
        throw new Error("Parameter 'accountSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(countryCode)) {
        throw new Error("Parameter 'countryCode' is not valid.");
    }
    const instance = {};
    instance._version = version;
    instance._solution = { accountSid, countryCode };
    instance._uri = `/Accounts/${accountSid}/AvailablePhoneNumbers/${countryCode}/TollFree.json`;
    instance.page = function page(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["areaCode"] !== undefined)
            data["AreaCode"] = params["areaCode"];
        if (params["contains"] !== undefined)
            data["Contains"] = params["contains"];
        if (params["smsEnabled"] !== undefined)
            data["SmsEnabled"] = serialize.bool(params["smsEnabled"]);
        if (params["mmsEnabled"] !== undefined)
            data["MmsEnabled"] = serialize.bool(params["mmsEnabled"]);
        if (params["voiceEnabled"] !== undefined)
            data["VoiceEnabled"] = serialize.bool(params["voiceEnabled"]);
        if (params["excludeAllAddressRequired"] !== undefined)
            data["ExcludeAllAddressRequired"] = serialize.bool(params["excludeAllAddressRequired"]);
        if (params["excludeLocalAddressRequired"] !== undefined)
            data["ExcludeLocalAddressRequired"] = serialize.bool(params["excludeLocalAddressRequired"]);
        if (params["excludeForeignAddressRequired"] !== undefined)
            data["ExcludeForeignAddressRequired"] = serialize.bool(params["excludeForeignAddressRequired"]);
        if (params["beta"] !== undefined)
            data["Beta"] = serialize.bool(params["beta"]);
        if (params["nearNumber"] !== undefined)
            data["NearNumber"] = params["nearNumber"];
        if (params["nearLatLong"] !== undefined)
            data["NearLatLong"] = params["nearLatLong"];
        if (params["distance"] !== undefined)
            data["Distance"] = params["distance"];
        if (params["inPostalCode"] !== undefined)
            data["InPostalCode"] = params["inPostalCode"];
        if (params["inRegion"] !== undefined)
            data["InRegion"] = params["inRegion"];
        if (params["inRateCenter"] !== undefined)
            data["InRateCenter"] = params["inRateCenter"];
        if (params["inLata"] !== undefined)
            data["InLata"] = params["inLata"];
        if (params["inLocality"] !== undefined)
            data["InLocality"] = params["inLocality"];
        if (params["faxEnabled"] !== undefined)
            data["FaxEnabled"] = serialize.bool(params["faxEnabled"]);
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
        operationPromise = operationPromise.then((payload) => new TollFreePage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new TollFreePage(instance._version, payload, instance._solution));
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
exports.TollFreeListInstance = TollFreeListInstance;
class TollFreeInstance {
    constructor(_version, payload, accountSid, countryCode) {
        this._version = _version;
        this.friendlyName = payload.friendly_name;
        this.phoneNumber = payload.phone_number;
        this.lata = payload.lata;
        this.locality = payload.locality;
        this.rateCenter = payload.rate_center;
        this.latitude = payload.latitude;
        this.longitude = payload.longitude;
        this.region = payload.region;
        this.postalCode = payload.postal_code;
        this.isoCountry = payload.iso_country;
        this.addressRequirements = payload.address_requirements;
        this.beta = payload.beta;
        this.capabilities = payload.capabilities;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            friendlyName: this.friendlyName,
            phoneNumber: this.phoneNumber,
            lata: this.lata,
            locality: this.locality,
            rateCenter: this.rateCenter,
            latitude: this.latitude,
            longitude: this.longitude,
            region: this.region,
            postalCode: this.postalCode,
            isoCountry: this.isoCountry,
            addressRequirements: this.addressRequirements,
            beta: this.beta,
            capabilities: this.capabilities,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.TollFreeInstance = TollFreeInstance;
class TollFreePage extends Page_1.default {
    /**
     * Initialize the TollFreePage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of TollFreeInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new TollFreeInstance(this._version, payload, this._solution.accountSid, this._solution.countryCode);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.TollFreePage = TollFreePage;
