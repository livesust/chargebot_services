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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataListInstance = exports.DataInstance = exports.DataContextImpl = void 0;
const util_1 = require("util");
const deserialize = require("../../../../../../../base/deserialize");
const serialize = require("../../../../../../../base/serialize");
const utility_1 = require("../../../../../../../base/utility");
class DataContextImpl {
    constructor(_version, accountSid, referenceSid, addOnResultSid, payloadSid) {
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
        if (!(0, utility_1.isValidPathParam)(payloadSid)) {
            throw new Error("Parameter 'payloadSid' is not valid.");
        }
        this._solution = { accountSid, referenceSid, addOnResultSid, payloadSid };
        this._uri = `/Accounts/${accountSid}/Recordings/${referenceSid}/AddOnResults/${addOnResultSid}/Payloads/${payloadSid}/Data.json`;
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
        operationPromise = operationPromise.then((payload) => new DataInstance(operationVersion, payload, instance._solution.accountSid, instance._solution.referenceSid, instance._solution.addOnResultSid, instance._solution.payloadSid));
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
exports.DataContextImpl = DataContextImpl;
class DataInstance {
    constructor(_version, payload, accountSid, referenceSid, addOnResultSid, payloadSid) {
        this._version = _version;
        this.redirectTo = payload.redirect_to;
        this._solution = { accountSid, referenceSid, addOnResultSid, payloadSid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new DataContextImpl(this._version, this._solution.accountSid, this._solution.referenceSid, this._solution.addOnResultSid, this._solution.payloadSid);
        return this._context;
    }
    /**
     * Fetch a DataInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed DataInstance
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
            redirectTo: this.redirectTo,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.DataInstance = DataInstance;
function DataListInstance(version, accountSid, referenceSid, addOnResultSid, payloadSid) {
    if (!(0, utility_1.isValidPathParam)(accountSid)) {
        throw new Error("Parameter 'accountSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(referenceSid)) {
        throw new Error("Parameter 'referenceSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(addOnResultSid)) {
        throw new Error("Parameter 'addOnResultSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(payloadSid)) {
        throw new Error("Parameter 'payloadSid' is not valid.");
    }
    const instance = (() => instance.get());
    instance.get = function get() {
        return new DataContextImpl(version, accountSid, referenceSid, addOnResultSid, payloadSid);
    };
    instance._version = version;
    instance._solution = { accountSid, referenceSid, addOnResultSid, payloadSid };
    instance._uri = ``;
    instance.toJSON = function toJSON() {
        return instance._solution;
    };
    instance[util_1.inspect.custom] = function inspectImpl(_depth, options) {
        return (0, util_1.inspect)(instance.toJSON(), options);
    };
    return instance;
}
exports.DataListInstance = DataListInstance;
