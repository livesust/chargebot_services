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
exports.OperatorAttachmentListInstance = exports.OperatorAttachmentInstance = exports.OperatorAttachmentContextImpl = void 0;
const util_1 = require("util");
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
const utility_1 = require("../../../base/utility");
class OperatorAttachmentContextImpl {
    constructor(_version, serviceSid, operatorSid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(serviceSid)) {
            throw new Error("Parameter 'serviceSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(operatorSid)) {
            throw new Error("Parameter 'operatorSid' is not valid.");
        }
        this._solution = { serviceSid, operatorSid };
        this._uri = `/Services/${serviceSid}/Operators/${operatorSid}`;
    }
    create(callback) {
        const headers = {};
        headers["Accept"] = "application/json";
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            headers,
        });
        operationPromise = operationPromise.then((payload) => new OperatorAttachmentInstance(operationVersion, payload, instance._solution.serviceSid, instance._solution.operatorSid));
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
    }
    remove(callback) {
        const headers = {};
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.remove({
            uri: instance._uri,
            method: "delete",
            headers,
        });
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
exports.OperatorAttachmentContextImpl = OperatorAttachmentContextImpl;
class OperatorAttachmentInstance {
    constructor(_version, payload, serviceSid, operatorSid) {
        this._version = _version;
        this.serviceSid = payload.service_sid;
        this.operatorSid = payload.operator_sid;
        this.url = payload.url;
        this._solution = {
            serviceSid: serviceSid || this.serviceSid,
            operatorSid: operatorSid || this.operatorSid,
        };
    }
    get _proxy() {
        this._context =
            this._context ||
                new OperatorAttachmentContextImpl(this._version, this._solution.serviceSid, this._solution.operatorSid);
        return this._context;
    }
    /**
     * Create a OperatorAttachmentInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed OperatorAttachmentInstance
     */
    create(callback) {
        return this._proxy.create(callback);
    }
    /**
     * Remove a OperatorAttachmentInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed boolean
     */
    remove(callback) {
        return this._proxy.remove(callback);
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            serviceSid: this.serviceSid,
            operatorSid: this.operatorSid,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.OperatorAttachmentInstance = OperatorAttachmentInstance;
function OperatorAttachmentListInstance(version) {
    const instance = ((serviceSid, operatorSid) => instance.get(serviceSid, operatorSid));
    instance.get = function get(serviceSid, operatorSid) {
        return new OperatorAttachmentContextImpl(version, serviceSid, operatorSid);
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
exports.OperatorAttachmentListInstance = OperatorAttachmentListInstance;
