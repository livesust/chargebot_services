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
exports.SentencePage = exports.SentenceInstance = exports.SentenceListInstance = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
function SentenceListInstance(version, transcriptSid) {
    if (!(0, utility_1.isValidPathParam)(transcriptSid)) {
        throw new Error("Parameter 'transcriptSid' is not valid.");
    }
    const instance = {};
    instance._version = version;
    instance._solution = { transcriptSid };
    instance._uri = `/Transcripts/${transcriptSid}/Sentences`;
    instance.page = function page(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["redacted"] !== undefined)
            data["Redacted"] = serialize.bool(params["redacted"]);
        if (params["wordTimestamps"] !== undefined)
            data["WordTimestamps"] = serialize.bool(params["wordTimestamps"]);
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
        operationPromise = operationPromise.then((payload) => new SentencePage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new SentencePage(instance._version, payload, instance._solution));
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
exports.SentenceListInstance = SentenceListInstance;
class SentenceInstance {
    constructor(_version, payload, transcriptSid) {
        this._version = _version;
        this.mediaChannel = deserialize.integer(payload.media_channel);
        this.sentenceIndex = deserialize.integer(payload.sentence_index);
        this.startTime = payload.start_time;
        this.endTime = payload.end_time;
        this.transcript = payload.transcript;
        this.sid = payload.sid;
        this.confidence = payload.confidence;
        this.words = payload.words;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            mediaChannel: this.mediaChannel,
            sentenceIndex: this.sentenceIndex,
            startTime: this.startTime,
            endTime: this.endTime,
            transcript: this.transcript,
            sid: this.sid,
            confidence: this.confidence,
            words: this.words,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.SentenceInstance = SentenceInstance;
class SentencePage extends Page_1.default {
    /**
     * Initialize the SentencePage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of SentenceInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new SentenceInstance(this._version, payload, this._solution.transcriptSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.SentencePage = SentencePage;
