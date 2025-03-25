"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Taskrouter
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
exports.EventPage = exports.EventListInstance = exports.EventInstance = exports.EventContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
class EventContextImpl {
    constructor(_version, workspaceSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(workspaceSid)) {
            throw new Error("Parameter 'workspaceSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { workspaceSid, sid };
        this._uri = `/Workspaces/${workspaceSid}/Events/${sid}`;
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
        operationPromise = operationPromise.then((payload) => new EventInstance(operationVersion, payload, instance._solution.workspaceSid, instance._solution.sid));
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
exports.EventContextImpl = EventContextImpl;
class EventInstance {
    constructor(_version, payload, workspaceSid, sid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.actorSid = payload.actor_sid;
        this.actorType = payload.actor_type;
        this.actorUrl = payload.actor_url;
        this.description = payload.description;
        this.eventData = payload.event_data;
        this.eventDate = deserialize.iso8601DateTime(payload.event_date);
        this.eventDateMs = payload.event_date_ms;
        this.eventType = payload.event_type;
        this.resourceSid = payload.resource_sid;
        this.resourceType = payload.resource_type;
        this.resourceUrl = payload.resource_url;
        this.sid = payload.sid;
        this.source = payload.source;
        this.sourceIpAddress = payload.source_ip_address;
        this.url = payload.url;
        this.workspaceSid = payload.workspace_sid;
        this._solution = { workspaceSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new EventContextImpl(this._version, this._solution.workspaceSid, this._solution.sid);
        return this._context;
    }
    /**
     * Fetch a EventInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed EventInstance
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
            actorSid: this.actorSid,
            actorType: this.actorType,
            actorUrl: this.actorUrl,
            description: this.description,
            eventData: this.eventData,
            eventDate: this.eventDate,
            eventDateMs: this.eventDateMs,
            eventType: this.eventType,
            resourceSid: this.resourceSid,
            resourceType: this.resourceType,
            resourceUrl: this.resourceUrl,
            sid: this.sid,
            source: this.source,
            sourceIpAddress: this.sourceIpAddress,
            url: this.url,
            workspaceSid: this.workspaceSid,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.EventInstance = EventInstance;
function EventListInstance(version, workspaceSid) {
    if (!(0, utility_1.isValidPathParam)(workspaceSid)) {
        throw new Error("Parameter 'workspaceSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new EventContextImpl(version, workspaceSid, sid);
    };
    instance._version = version;
    instance._solution = { workspaceSid };
    instance._uri = `/Workspaces/${workspaceSid}/Events`;
    instance.page = function page(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["endDate"] !== undefined)
            data["EndDate"] = serialize.iso8601DateTime(params["endDate"]);
        if (params["eventType"] !== undefined)
            data["EventType"] = params["eventType"];
        if (params["minutes"] !== undefined)
            data["Minutes"] = params["minutes"];
        if (params["reservationSid"] !== undefined)
            data["ReservationSid"] = params["reservationSid"];
        if (params["startDate"] !== undefined)
            data["StartDate"] = serialize.iso8601DateTime(params["startDate"]);
        if (params["taskQueueSid"] !== undefined)
            data["TaskQueueSid"] = params["taskQueueSid"];
        if (params["taskSid"] !== undefined)
            data["TaskSid"] = params["taskSid"];
        if (params["workerSid"] !== undefined)
            data["WorkerSid"] = params["workerSid"];
        if (params["workflowSid"] !== undefined)
            data["WorkflowSid"] = params["workflowSid"];
        if (params["taskChannel"] !== undefined)
            data["TaskChannel"] = params["taskChannel"];
        if (params["sid"] !== undefined)
            data["Sid"] = params["sid"];
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
        operationPromise = operationPromise.then((payload) => new EventPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new EventPage(instance._version, payload, instance._solution));
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
exports.EventListInstance = EventListInstance;
class EventPage extends Page_1.default {
    /**
     * Initialize the EventPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of EventInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new EventInstance(this._version, payload, this._solution.workspaceSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.EventPage = EventPage;
