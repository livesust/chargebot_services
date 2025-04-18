"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Marketplace
 * This is the public Twilio REST API.
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleDataInstance = exports.ModuleDataListInstance = void 0;
const util_1 = require("util");
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
function ModuleDataListInstance(version) {
    const instance = {};
    instance._version = version;
    instance._solution = {};
    instance._uri = `/Listings`;
    instance.create = function create(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["moduleInfo"] !== undefined)
            data["ModuleInfo"] = params["moduleInfo"];
        if (params["configuration"] !== undefined)
            data["Configuration"] = params["configuration"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new ModuleDataInstance(operationVersion, payload));
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
    };
    instance.fetch = function fetch(callback) {
        const headers = {};
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.fetch({
            uri: instance._uri,
            method: "get",
            headers,
        });
        operationPromise = operationPromise.then((payload) => new ModuleDataInstance(operationVersion, payload));
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
    };
    instance.toJSON = function toJSON() {
        return instance._solution;
    };
    instance[util_1.inspect.custom] = function inspectImpl(_depth, options) {
        return (0, util_1.inspect)(instance.toJSON(), options);
    };
    return instance;
}
exports.ModuleDataListInstance = ModuleDataListInstance;
class ModuleDataInstance {
    constructor(_version, payload) {
        this._version = _version;
        this.url = payload.url;
        this.sid = payload.sid;
        this.description = payload.description;
        this.support = payload.support;
        this.policies = payload.policies;
        this.moduleInfo = payload.module_info;
        this.documentation = payload.documentation;
        this.configuration = payload.configuration;
        this.pricing = payload.pricing;
        this.listings = payload.listings;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            url: this.url,
            sid: this.sid,
            description: this.description,
            support: this.support,
            policies: this.policies,
            moduleInfo: this.moduleInfo,
            documentation: this.documentation,
            configuration: this.configuration,
            pricing: this.pricing,
            listings: this.listings,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.ModuleDataInstance = ModuleDataInstance;
