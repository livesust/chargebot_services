"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Trusthub
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
exports.TrustProductsEvaluationsPage = exports.TrustProductsEvaluationsListInstance = exports.TrustProductsEvaluationsInstance = exports.TrustProductsEvaluationsContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
class TrustProductsEvaluationsContextImpl {
    constructor(_version, trustProductSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(trustProductSid)) {
            throw new Error("Parameter 'trustProductSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { trustProductSid, sid };
        this._uri = `/TrustProducts/${trustProductSid}/Evaluations/${sid}`;
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
        operationPromise = operationPromise.then((payload) => new TrustProductsEvaluationsInstance(operationVersion, payload, instance._solution.trustProductSid, instance._solution.sid));
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
exports.TrustProductsEvaluationsContextImpl = TrustProductsEvaluationsContextImpl;
class TrustProductsEvaluationsInstance {
    constructor(_version, payload, trustProductSid, sid) {
        this._version = _version;
        this.sid = payload.sid;
        this.accountSid = payload.account_sid;
        this.policySid = payload.policy_sid;
        this.trustProductSid = payload.trust_product_sid;
        this.status = payload.status;
        this.results = payload.results;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.url = payload.url;
        this._solution = { trustProductSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new TrustProductsEvaluationsContextImpl(this._version, this._solution.trustProductSid, this._solution.sid);
        return this._context;
    }
    /**
     * Fetch a TrustProductsEvaluationsInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed TrustProductsEvaluationsInstance
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
            policySid: this.policySid,
            trustProductSid: this.trustProductSid,
            status: this.status,
            results: this.results,
            dateCreated: this.dateCreated,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.TrustProductsEvaluationsInstance = TrustProductsEvaluationsInstance;
function TrustProductsEvaluationsListInstance(version, trustProductSid) {
    if (!(0, utility_1.isValidPathParam)(trustProductSid)) {
        throw new Error("Parameter 'trustProductSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new TrustProductsEvaluationsContextImpl(version, trustProductSid, sid);
    };
    instance._version = version;
    instance._solution = { trustProductSid };
    instance._uri = `/TrustProducts/${trustProductSid}/Evaluations`;
    instance.create = function create(params, callback) {
        if (params === null || params === undefined) {
            throw new Error('Required parameter "params" missing.');
        }
        if (params["policySid"] === null || params["policySid"] === undefined) {
            throw new Error("Required parameter \"params['policySid']\" missing.");
        }
        let data = {};
        data["PolicySid"] = params["policySid"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new TrustProductsEvaluationsInstance(operationVersion, payload, instance._solution.trustProductSid));
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
        operationPromise = operationPromise.then((payload) => new TrustProductsEvaluationsPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new TrustProductsEvaluationsPage(instance._version, payload, instance._solution));
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
exports.TrustProductsEvaluationsListInstance = TrustProductsEvaluationsListInstance;
class TrustProductsEvaluationsPage extends Page_1.default {
    /**
     * Initialize the TrustProductsEvaluationsPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of TrustProductsEvaluationsInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new TrustProductsEvaluationsInstance(this._version, payload, this._solution.trustProductSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.TrustProductsEvaluationsPage = TrustProductsEvaluationsPage;
