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
exports.AuthRegistrationsCredentialListMappingPage = exports.AuthRegistrationsCredentialListMappingListInstance = exports.AuthRegistrationsCredentialListMappingInstance = exports.AuthRegistrationsCredentialListMappingContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../../../../../base/Page"));
const deserialize = require("../../../../../../../../base/deserialize");
const serialize = require("../../../../../../../../base/serialize");
const utility_1 = require("../../../../../../../../base/utility");
class AuthRegistrationsCredentialListMappingContextImpl {
    constructor(_version, accountSid, domainSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(accountSid)) {
            throw new Error("Parameter 'accountSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(domainSid)) {
            throw new Error("Parameter 'domainSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { accountSid, domainSid, sid };
        this._uri = `/Accounts/${accountSid}/SIP/Domains/${domainSid}/Auth/Registrations/CredentialListMappings/${sid}.json`;
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
    fetch(callback) {
        const headers = {};
        headers["Accept"] = "application/json";
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.fetch({
            uri: instance._uri,
            method: "get",
            headers,
        });
        operationPromise = operationPromise.then((payload) => new AuthRegistrationsCredentialListMappingInstance(operationVersion, payload, instance._solution.accountSid, instance._solution.domainSid, instance._solution.sid));
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
exports.AuthRegistrationsCredentialListMappingContextImpl = AuthRegistrationsCredentialListMappingContextImpl;
class AuthRegistrationsCredentialListMappingInstance {
    constructor(_version, payload, accountSid, domainSid, sid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.dateCreated = deserialize.rfc2822DateTime(payload.date_created);
        this.dateUpdated = deserialize.rfc2822DateTime(payload.date_updated);
        this.friendlyName = payload.friendly_name;
        this.sid = payload.sid;
        this._solution = { accountSid, domainSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new AuthRegistrationsCredentialListMappingContextImpl(this._version, this._solution.accountSid, this._solution.domainSid, this._solution.sid);
        return this._context;
    }
    /**
     * Remove a AuthRegistrationsCredentialListMappingInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed boolean
     */
    remove(callback) {
        return this._proxy.remove(callback);
    }
    /**
     * Fetch a AuthRegistrationsCredentialListMappingInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed AuthRegistrationsCredentialListMappingInstance
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
            accountSid: this.accountSid,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
            friendlyName: this.friendlyName,
            sid: this.sid,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.AuthRegistrationsCredentialListMappingInstance = AuthRegistrationsCredentialListMappingInstance;
function AuthRegistrationsCredentialListMappingListInstance(version, accountSid, domainSid) {
    if (!(0, utility_1.isValidPathParam)(accountSid)) {
        throw new Error("Parameter 'accountSid' is not valid.");
    }
    if (!(0, utility_1.isValidPathParam)(domainSid)) {
        throw new Error("Parameter 'domainSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new AuthRegistrationsCredentialListMappingContextImpl(version, accountSid, domainSid, sid);
    };
    instance._version = version;
    instance._solution = { accountSid, domainSid };
    instance._uri = `/Accounts/${accountSid}/SIP/Domains/${domainSid}/Auth/Registrations/CredentialListMappings.json`;
    instance.create = function create(params, callback) {
        if (params === null || params === undefined) {
            throw new Error('Required parameter "params" missing.');
        }
        if (params["credentialListSid"] === null ||
            params["credentialListSid"] === undefined) {
            throw new Error("Required parameter \"params['credentialListSid']\" missing.");
        }
        let data = {};
        data["CredentialListSid"] = params["credentialListSid"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new AuthRegistrationsCredentialListMappingInstance(operationVersion, payload, instance._solution.accountSid, instance._solution.domainSid));
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
    };
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
        operationPromise = operationPromise.then((payload) => new AuthRegistrationsCredentialListMappingPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new AuthRegistrationsCredentialListMappingPage(instance._version, payload, instance._solution));
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
exports.AuthRegistrationsCredentialListMappingListInstance = AuthRegistrationsCredentialListMappingListInstance;
class AuthRegistrationsCredentialListMappingPage extends Page_1.default {
    /**
     * Initialize the AuthRegistrationsCredentialListMappingPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of AuthRegistrationsCredentialListMappingInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new AuthRegistrationsCredentialListMappingInstance(this._version, payload, this._solution.accountSid, this._solution.domainSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.AuthRegistrationsCredentialListMappingPage = AuthRegistrationsCredentialListMappingPage;
