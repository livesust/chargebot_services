"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Lookups
 * This is the public Twilio REST API.
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumberListInstance = exports.PhoneNumberInstance = exports.PhoneNumberContextImpl = void 0;
const util_1 = require("util");
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
const utility_1 = require("../../../base/utility");
class PhoneNumberContextImpl {
    constructor(_version, phoneNumber) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(phoneNumber)) {
            throw new Error("Parameter 'phoneNumber' is not valid.");
        }
        this._solution = { phoneNumber };
        this._uri = `/PhoneNumbers/${phoneNumber}`;
    }
    fetch(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["countryCode"] !== undefined)
            data["CountryCode"] = params["countryCode"];
        if (params["type"] !== undefined)
            data["Type"] = serialize.map(params["type"], (e) => e);
        if (params["addOns"] !== undefined)
            data["AddOns"] = serialize.map(params["addOns"], (e) => e);
        if (params["addOnsData"] !== undefined)
            data = {
                ...data,
                ...serialize.prefixedCollapsibleMap(params["addOnsData"], "AddOns"),
            };
        const headers = {};
        headers["Accept"] = "application/json";
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.fetch({
            uri: instance._uri,
            method: "get",
            params: data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new PhoneNumberInstance(operationVersion, payload, instance._solution.phoneNumber));
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
exports.PhoneNumberContextImpl = PhoneNumberContextImpl;
class PhoneNumberInstance {
    constructor(_version, payload, phoneNumber) {
        this._version = _version;
        this.callerName = payload.caller_name;
        this.countryCode = payload.country_code;
        this.phoneNumber = payload.phone_number;
        this.nationalFormat = payload.national_format;
        this.carrier = payload.carrier;
        this.addOns = payload.add_ons;
        this.url = payload.url;
        this._solution = { phoneNumber: phoneNumber || this.phoneNumber };
    }
    get _proxy() {
        this._context =
            this._context ||
                new PhoneNumberContextImpl(this._version, this._solution.phoneNumber);
        return this._context;
    }
    fetch(params, callback) {
        return this._proxy.fetch(params, callback);
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            callerName: this.callerName,
            countryCode: this.countryCode,
            phoneNumber: this.phoneNumber,
            nationalFormat: this.nationalFormat,
            carrier: this.carrier,
            addOns: this.addOns,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.PhoneNumberInstance = PhoneNumberInstance;
function PhoneNumberListInstance(version) {
    const instance = ((phoneNumber) => instance.get(phoneNumber));
    instance.get = function get(phoneNumber) {
        return new PhoneNumberContextImpl(version, phoneNumber);
    };
    instance._version = version;
    instance._solution = {};
    instance._uri = ``;
    instance.toJSON = function toJSON() {
        return instance._solution;
    };
    instance[util_1.inspect.custom] = function inspectImpl(_depth, options) {
        return (0, util_1.inspect)(instance.toJSON(), options);
    };
    return instance;
}
exports.PhoneNumberListInstance = PhoneNumberListInstance;
