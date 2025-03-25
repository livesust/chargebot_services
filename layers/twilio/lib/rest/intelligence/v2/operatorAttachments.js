"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Intelligence
 * This is the public Twilio REST API.
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorAttachmentsListInstance = exports.OperatorAttachmentsInstance = exports.OperatorAttachmentsContextImpl = void 0;
const util_1 = require("util");
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
const utility_1 = require("../../../base/utility");
class OperatorAttachmentsContextImpl {
    constructor(_version, serviceSid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(serviceSid)) {
            throw new Error("Parameter 'serviceSid' is not valid.");
        }
        this._solution = { serviceSid };
        this._uri = `/Services/${serviceSid}/Operators`;
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
        operationPromise = operationPromise.then((payload) => new OperatorAttachmentsInstance(operationVersion, payload, instance._solution.serviceSid));
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
exports.OperatorAttachmentsContextImpl = OperatorAttachmentsContextImpl;
class OperatorAttachmentsInstance {
    constructor(_version, payload, serviceSid) {
        this._version = _version;
        this.serviceSid = payload.service_sid;
        this.operatorSids = payload.operator_sids;
        this.url = payload.url;
        this._solution = { serviceSid: serviceSid || this.serviceSid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new OperatorAttachmentsContextImpl(this._version, this._solution.serviceSid);
        return this._context;
    }
    /**
     * Fetch a OperatorAttachmentsInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed OperatorAttachmentsInstance
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
            serviceSid: this.serviceSid,
            operatorSids: this.operatorSids,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.OperatorAttachmentsInstance = OperatorAttachmentsInstance;
function OperatorAttachmentsListInstance(version) {
    const instance = ((serviceSid) => instance.get(serviceSid));
    instance.get = function get(serviceSid) {
        return new OperatorAttachmentsContextImpl(version, serviceSid);
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
exports.OperatorAttachmentsListInstance = OperatorAttachmentsListInstance;
