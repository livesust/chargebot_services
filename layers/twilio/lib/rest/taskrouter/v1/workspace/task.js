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
exports.TaskPage = exports.TaskListInstance = exports.TaskInstance = exports.TaskContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
const reservation_1 = require("./task/reservation");
class TaskContextImpl {
    constructor(_version, workspaceSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(workspaceSid)) {
            throw new Error("Parameter 'workspaceSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { workspaceSid, sid };
        this._uri = `/Workspaces/${workspaceSid}/Tasks/${sid}`;
    }
    get reservations() {
        this._reservations =
            this._reservations ||
                (0, reservation_1.ReservationListInstance)(this._version, this._solution.workspaceSid, this._solution.sid);
        return this._reservations;
    }
    remove(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        const headers = {};
        if (params["ifMatch"] !== undefined)
            headers["If-Match"] = params["ifMatch"];
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.remove({
            uri: instance._uri,
            method: "delete",
            params: data,
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
        operationPromise = operationPromise.then((payload) => new TaskInstance(operationVersion, payload, instance._solution.workspaceSid, instance._solution.sid));
        operationPromise = instance._version.setPromiseCallback(operationPromise, callback);
        return operationPromise;
    }
    update(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["attributes"] !== undefined)
            data["Attributes"] = params["attributes"];
        if (params["assignmentStatus"] !== undefined)
            data["AssignmentStatus"] = params["assignmentStatus"];
        if (params["reason"] !== undefined)
            data["Reason"] = params["reason"];
        if (params["priority"] !== undefined)
            data["Priority"] = params["priority"];
        if (params["taskChannel"] !== undefined)
            data["TaskChannel"] = params["taskChannel"];
        if (params["virtualStartTime"] !== undefined)
            data["VirtualStartTime"] = serialize.iso8601DateTime(params["virtualStartTime"]);
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        if (params["ifMatch"] !== undefined)
            headers["If-Match"] = params["ifMatch"];
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.update({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new TaskInstance(operationVersion, payload, instance._solution.workspaceSid, instance._solution.sid));
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
exports.TaskContextImpl = TaskContextImpl;
class TaskInstance {
    constructor(_version, payload, workspaceSid, sid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.age = deserialize.integer(payload.age);
        this.assignmentStatus = payload.assignment_status;
        this.attributes = payload.attributes;
        this.addons = payload.addons;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated);
        this.taskQueueEnteredDate = deserialize.iso8601DateTime(payload.task_queue_entered_date);
        this.priority = deserialize.integer(payload.priority);
        this.reason = payload.reason;
        this.sid = payload.sid;
        this.taskQueueSid = payload.task_queue_sid;
        this.taskQueueFriendlyName = payload.task_queue_friendly_name;
        this.taskChannelSid = payload.task_channel_sid;
        this.taskChannelUniqueName = payload.task_channel_unique_name;
        this.timeout = deserialize.integer(payload.timeout);
        this.workflowSid = payload.workflow_sid;
        this.workflowFriendlyName = payload.workflow_friendly_name;
        this.workspaceSid = payload.workspace_sid;
        this.url = payload.url;
        this.links = payload.links;
        this.virtualStartTime = deserialize.iso8601DateTime(payload.virtual_start_time);
        this.ignoreCapacity = payload.ignore_capacity;
        this.routingTarget = payload.routing_target;
        this._solution = { workspaceSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new TaskContextImpl(this._version, this._solution.workspaceSid, this._solution.sid);
        return this._context;
    }
    remove(params, callback) {
        return this._proxy.remove(params, callback);
    }
    /**
     * Fetch a TaskInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed TaskInstance
     */
    fetch(callback) {
        return this._proxy.fetch(callback);
    }
    update(params, callback) {
        return this._proxy.update(params, callback);
    }
    /**
     * Access the reservations.
     */
    reservations() {
        return this._proxy.reservations;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            accountSid: this.accountSid,
            age: this.age,
            assignmentStatus: this.assignmentStatus,
            attributes: this.attributes,
            addons: this.addons,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
            taskQueueEnteredDate: this.taskQueueEnteredDate,
            priority: this.priority,
            reason: this.reason,
            sid: this.sid,
            taskQueueSid: this.taskQueueSid,
            taskQueueFriendlyName: this.taskQueueFriendlyName,
            taskChannelSid: this.taskChannelSid,
            taskChannelUniqueName: this.taskChannelUniqueName,
            timeout: this.timeout,
            workflowSid: this.workflowSid,
            workflowFriendlyName: this.workflowFriendlyName,
            workspaceSid: this.workspaceSid,
            url: this.url,
            links: this.links,
            virtualStartTime: this.virtualStartTime,
            ignoreCapacity: this.ignoreCapacity,
            routingTarget: this.routingTarget,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.TaskInstance = TaskInstance;
function TaskListInstance(version, workspaceSid) {
    if (!(0, utility_1.isValidPathParam)(workspaceSid)) {
        throw new Error("Parameter 'workspaceSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new TaskContextImpl(version, workspaceSid, sid);
    };
    instance._version = version;
    instance._solution = { workspaceSid };
    instance._uri = `/Workspaces/${workspaceSid}/Tasks`;
    instance.create = function create(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["timeout"] !== undefined)
            data["Timeout"] = params["timeout"];
        if (params["priority"] !== undefined)
            data["Priority"] = params["priority"];
        if (params["taskChannel"] !== undefined)
            data["TaskChannel"] = params["taskChannel"];
        if (params["workflowSid"] !== undefined)
            data["WorkflowSid"] = params["workflowSid"];
        if (params["attributes"] !== undefined)
            data["Attributes"] = params["attributes"];
        if (params["virtualStartTime"] !== undefined)
            data["VirtualStartTime"] = serialize.iso8601DateTime(params["virtualStartTime"]);
        if (params["routingTarget"] !== undefined)
            data["RoutingTarget"] = params["routingTarget"];
        if (params["ignoreCapacity"] !== undefined)
            data["IgnoreCapacity"] = params["ignoreCapacity"];
        if (params["taskQueueSid"] !== undefined)
            data["TaskQueueSid"] = params["taskQueueSid"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new TaskInstance(operationVersion, payload, instance._solution.workspaceSid));
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
        if (params["priority"] !== undefined)
            data["Priority"] = params["priority"];
        if (params["assignmentStatus"] !== undefined)
            data["AssignmentStatus"] = serialize.map(params["assignmentStatus"], (e) => e);
        if (params["workflowSid"] !== undefined)
            data["WorkflowSid"] = params["workflowSid"];
        if (params["workflowName"] !== undefined)
            data["WorkflowName"] = params["workflowName"];
        if (params["taskQueueSid"] !== undefined)
            data["TaskQueueSid"] = params["taskQueueSid"];
        if (params["taskQueueName"] !== undefined)
            data["TaskQueueName"] = params["taskQueueName"];
        if (params["evaluateTaskAttributes"] !== undefined)
            data["EvaluateTaskAttributes"] = params["evaluateTaskAttributes"];
        if (params["routingTarget"] !== undefined)
            data["RoutingTarget"] = params["routingTarget"];
        if (params["ordering"] !== undefined)
            data["Ordering"] = params["ordering"];
        if (params["hasAddons"] !== undefined)
            data["HasAddons"] = serialize.bool(params["hasAddons"]);
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
        operationPromise = operationPromise.then((payload) => new TaskPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new TaskPage(instance._version, payload, instance._solution));
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
exports.TaskListInstance = TaskListInstance;
class TaskPage extends Page_1.default {
    /**
     * Initialize the TaskPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of TaskInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new TaskInstance(this._version, payload, this._solution.workspaceSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.TaskPage = TaskPage;
