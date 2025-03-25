"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Video
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
exports.RoomRecordingPage = exports.RoomRecordingListInstance = exports.RoomRecordingInstance = exports.RoomRecordingContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
class RoomRecordingContextImpl {
    constructor(_version, roomSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(roomSid)) {
            throw new Error("Parameter 'roomSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { roomSid, sid };
        this._uri = `/Rooms/${roomSid}/Recordings/${sid}`;
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
        operationPromise = operationPromise.then((payload) => new RoomRecordingInstance(operationVersion, payload, instance._solution.roomSid, instance._solution.sid));
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
exports.RoomRecordingContextImpl = RoomRecordingContextImpl;
class RoomRecordingInstance {
    constructor(_version, payload, roomSid, sid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.status = payload.status;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.sid = payload.sid;
        this.sourceSid = payload.source_sid;
        this.size = payload.size;
        this.url = payload.url;
        this.type = payload.type;
        this.duration = deserialize.integer(payload.duration);
        this.containerFormat = payload.container_format;
        this.codec = payload.codec;
        this.groupingSids = payload.grouping_sids;
        this.trackName = payload.track_name;
        this.offset = payload.offset;
        this.mediaExternalLocation = payload.media_external_location;
        this.roomSid = payload.room_sid;
        this.links = payload.links;
        this._solution = { roomSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new RoomRecordingContextImpl(this._version, this._solution.roomSid, this._solution.sid);
        return this._context;
    }
    /**
     * Remove a RoomRecordingInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed boolean
     */
    remove(callback) {
        return this._proxy.remove(callback);
    }
    /**
     * Fetch a RoomRecordingInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed RoomRecordingInstance
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
            status: this.status,
            dateCreated: this.dateCreated,
            sid: this.sid,
            sourceSid: this.sourceSid,
            size: this.size,
            url: this.url,
            type: this.type,
            duration: this.duration,
            containerFormat: this.containerFormat,
            codec: this.codec,
            groupingSids: this.groupingSids,
            trackName: this.trackName,
            offset: this.offset,
            mediaExternalLocation: this.mediaExternalLocation,
            roomSid: this.roomSid,
            links: this.links,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.RoomRecordingInstance = RoomRecordingInstance;
function RoomRecordingListInstance(version, roomSid) {
    if (!(0, utility_1.isValidPathParam)(roomSid)) {
        throw new Error("Parameter 'roomSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new RoomRecordingContextImpl(version, roomSid, sid);
    };
    instance._version = version;
    instance._solution = { roomSid };
    instance._uri = `/Rooms/${roomSid}/Recordings`;
    instance.page = function page(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["status"] !== undefined)
            data["Status"] = params["status"];
        if (params["sourceSid"] !== undefined)
            data["SourceSid"] = params["sourceSid"];
        if (params["dateCreatedAfter"] !== undefined)
            data["DateCreatedAfter"] = serialize.iso8601DateTime(params["dateCreatedAfter"]);
        if (params["dateCreatedBefore"] !== undefined)
            data["DateCreatedBefore"] = serialize.iso8601DateTime(params["dateCreatedBefore"]);
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
        operationPromise = operationPromise.then((payload) => new RoomRecordingPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new RoomRecordingPage(instance._version, payload, instance._solution));
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
exports.RoomRecordingListInstance = RoomRecordingListInstance;
class RoomRecordingPage extends Page_1.default {
    /**
     * Initialize the RoomRecordingPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of RoomRecordingInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new RoomRecordingInstance(this._version, payload, this._solution.roomSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.RoomRecordingPage = RoomRecordingPage;
