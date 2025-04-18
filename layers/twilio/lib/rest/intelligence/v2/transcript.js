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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptPage = exports.TranscriptListInstance = exports.TranscriptInstance = exports.TranscriptContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../base/Page"));
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
const utility_1 = require("../../../base/utility");
const media_1 = require("./transcript/media");
const operatorResult_1 = require("./transcript/operatorResult");
const sentence_1 = require("./transcript/sentence");
class TranscriptContextImpl {
    constructor(_version, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { sid };
        this._uri = `/Transcripts/${sid}`;
    }
    get media() {
        this._media =
            this._media || (0, media_1.MediaListInstance)(this._version, this._solution.sid);
        return this._media;
    }
    get operatorResults() {
        this._operatorResults =
            this._operatorResults ||
                (0, operatorResult_1.OperatorResultListInstance)(this._version, this._solution.sid);
        return this._operatorResults;
    }
    get sentences() {
        this._sentences =
            this._sentences ||
                (0, sentence_1.SentenceListInstance)(this._version, this._solution.sid);
        return this._sentences;
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
        operationPromise = operationPromise.then((payload) => new TranscriptInstance(operationVersion, payload, instance._solution.sid));
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
exports.TranscriptContextImpl = TranscriptContextImpl;
class TranscriptInstance {
    constructor(_version, payload, sid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.serviceSid = payload.service_sid;
        this.sid = payload.sid;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated);
        this.status = payload.status;
        this.channel = payload.channel;
        this.dataLogging = payload.data_logging;
        this.languageCode = payload.language_code;
        this.customerKey = payload.customer_key;
        this.mediaStartTime = deserialize.iso8601DateTime(payload.media_start_time);
        this.duration = deserialize.integer(payload.duration);
        this.url = payload.url;
        this.redaction = payload.redaction;
        this.links = payload.links;
        this._solution = { sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new TranscriptContextImpl(this._version, this._solution.sid);
        return this._context;
    }
    /**
     * Remove a TranscriptInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed boolean
     */
    remove(callback) {
        return this._proxy.remove(callback);
    }
    /**
     * Fetch a TranscriptInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed TranscriptInstance
     */
    fetch(callback) {
        return this._proxy.fetch(callback);
    }
    /**
     * Access the media.
     */
    media() {
        return this._proxy.media;
    }
    /**
     * Access the operatorResults.
     */
    operatorResults() {
        return this._proxy.operatorResults;
    }
    /**
     * Access the sentences.
     */
    sentences() {
        return this._proxy.sentences;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            accountSid: this.accountSid,
            serviceSid: this.serviceSid,
            sid: this.sid,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
            status: this.status,
            channel: this.channel,
            dataLogging: this.dataLogging,
            languageCode: this.languageCode,
            customerKey: this.customerKey,
            mediaStartTime: this.mediaStartTime,
            duration: this.duration,
            url: this.url,
            redaction: this.redaction,
            links: this.links,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.TranscriptInstance = TranscriptInstance;
function TranscriptListInstance(version) {
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new TranscriptContextImpl(version, sid);
    };
    instance._version = version;
    instance._solution = {};
    instance._uri = `/Transcripts`;
    instance.create = function create(params, callback) {
        if (params === null || params === undefined) {
            throw new Error('Required parameter "params" missing.');
        }
        if (params["serviceSid"] === null || params["serviceSid"] === undefined) {
            throw new Error("Required parameter \"params['serviceSid']\" missing.");
        }
        if (params["channel"] === null || params["channel"] === undefined) {
            throw new Error("Required parameter \"params['channel']\" missing.");
        }
        let data = {};
        data["ServiceSid"] = params["serviceSid"];
        data["Channel"] = serialize.object(params["channel"]);
        if (params["customerKey"] !== undefined)
            data["CustomerKey"] = params["customerKey"];
        if (params["mediaStartTime"] !== undefined)
            data["MediaStartTime"] = serialize.iso8601DateTime(params["mediaStartTime"]);
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new TranscriptInstance(operationVersion, payload));
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
        if (params["serviceSid"] !== undefined)
            data["ServiceSid"] = params["serviceSid"];
        if (params["beforeStartTime"] !== undefined)
            data["BeforeStartTime"] = params["beforeStartTime"];
        if (params["afterStartTime"] !== undefined)
            data["AfterStartTime"] = params["afterStartTime"];
        if (params["beforeDateCreated"] !== undefined)
            data["BeforeDateCreated"] = params["beforeDateCreated"];
        if (params["afterDateCreated"] !== undefined)
            data["AfterDateCreated"] = params["afterDateCreated"];
        if (params["status"] !== undefined)
            data["Status"] = params["status"];
        if (params["languageCode"] !== undefined)
            data["LanguageCode"] = params["languageCode"];
        if (params["sourceSid"] !== undefined)
            data["SourceSid"] = params["sourceSid"];
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
        operationPromise = operationPromise.then((payload) => new TranscriptPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new TranscriptPage(instance._version, payload, instance._solution));
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
exports.TranscriptListInstance = TranscriptListInstance;
class TranscriptPage extends Page_1.default {
    /**
     * Initialize the TranscriptPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of TranscriptInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new TranscriptInstance(this._version, payload);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.TranscriptPage = TranscriptPage;
