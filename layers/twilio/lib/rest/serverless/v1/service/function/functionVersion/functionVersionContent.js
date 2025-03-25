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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionVersionContentListInstance = exports.FunctionVersionContentInstance = exports.FunctionVersionContentContextImpl = void 0;
const util_1 = require("util");
const deserialize = require("../../../../../../base/deserialize");
const serialize = require("../../../../../../base/serialize");
const utility_1 = require("../../../../../../base/utility");
class FunctionVersionContentContextImpl {
    constructor(_version, serviceSid, functionSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(serviceSid)) {
            throw new Error("Parameter 'serviceSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(functionSid)) {
            throw new Error("Parameter 'functionSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { serviceSid, functionSid, sid };
        this._uri = `/Services/${serviceSid}/Functions/${functionSid}/Versions/${sid}/Content`;
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
        operationPromise = operationPromise.then((payload) => new FunctionVersionContentInstance(operationVersion, payload, instance._solution.serviceSid, instance._solution.functionSid, instance._solution.sid));
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
exports.FunctionVersionContentContextImpl = FunctionVersionContentContextImpl;
class FunctionVersionContentInstance {
    constructor(_version, payload, serviceSid, functionSid, sid) {
        this._version = _version;
        this.sid = payload.sid;
        this.accountSid = payload.account_sid;
        this.serviceSid = payload.service_sid;
        this.functionSid = payload.function_sid;
        this.content = payload.content;
        this.url = payload.url;
        this._solution = { serviceSid, functionSid, sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new FunctionVersionContentContextImpl(this._version, this._solution.serviceSid, this._solution.functionSid, this._solution.sid);
        return this._context;
    }
    /**
     * Fetch a FunctionVersionContentInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed FunctionVersionContentInstance
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
            functionSid: this.functionSid,
            content: this.content,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.FunctionVersionContentInstance = FunctionVersionContentInstance;
function FunctionVersionContentListInstance(version, serviceSid, functionSid, sid) {
    if (!(0, utility_1.isValidPathParam)(serviceSid)) {
        throw new Error("Parameter 'serviceSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(functionSid)) {
        throw new Error("Parameter 'functionSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(sid)) {
        throw new Error("Parameter 'sid' is not valid.");
    }
    const instance = (() => instance.get());
    instance.get = function get() {
        return new FunctionVersionContentContextImpl(version, serviceSid, functionSid, sid);
    };
    instance._version = version;
    instance._solution = { serviceSid, functionSid, sid };
    instance._uri = ``;
    instance.toJSON = function toJSON() {
        return instance._solution;
    };
    instance[util_1.inspect.custom] = function inspectImpl(_depth, options) {
        return (0, util_1.inspect)(instance.toJSON(), options);
    };
    return instance;
}
exports.FunctionVersionContentListInstance = FunctionVersionContentListInstance;
