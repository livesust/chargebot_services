"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Conversations
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
exports.MessagePage = exports.MessageListInstance = exports.MessageInstance = exports.MessageContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
const deliveryReceipt_1 = require("./message/deliveryReceipt");
class MessageContextImpl {
    constructor(_version, conversationSid, sid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(conversationSid)) {
            throw new Error("Parameter 'conversationSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(sid)) {
            throw new Error("Parameter 'sid' is not valid.");
        }
        this._solution = { conversationSid, sid };
        this._uri = `/Conversations/${conversationSid}/Messages/${sid}`;
    }
    get deliveryReceipts() {
        this._deliveryReceipts =
            this._deliveryReceipts ||
                (0, deliveryReceipt_1.DeliveryReceiptListInstance)(this._version, this._solution.conversationSid, this._solution.sid);
        return this._deliveryReceipts;
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
        if (params["xTwilioWebhookEnabled"] !== undefined)
            headers["X-Twilio-Webhook-Enabled"] = params["xTwilioWebhookEnabled"];
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
        operationPromise = operationPromise.then((payload) => new MessageInstance(operationVersion, payload, instance._solution.conversationSid, instance._solution.sid));
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
        if (params["author"] !== undefined)
            data["Author"] = params["author"];
        if (params["body"] !== undefined)
            data["Body"] = params["body"];
        if (params["dateCreated"] !== undefined)
            data["DateCreated"] = serialize.iso8601DateTime(params["dateCreated"]);
        if (params["dateUpdated"] !== undefined)
            data["DateUpdated"] = serialize.iso8601DateTime(params["dateUpdated"]);
        if (params["attributes"] !== undefined)
            data["Attributes"] = params["attributes"];
        if (params["subject"] !== undefined)
            data["Subject"] = params["subject"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        if (params["xTwilioWebhookEnabled"] !== undefined)
            headers["X-Twilio-Webhook-Enabled"] = params["xTwilioWebhookEnabled"];
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.update({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new MessageInstance(operationVersion, payload, instance._solution.conversationSid, instance._solution.sid));
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
exports.MessageContextImpl = MessageContextImpl;
class MessageInstance {
    constructor(_version, payload, conversationSid, sid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.conversationSid = payload.conversation_sid;
        this.sid = payload.sid;
        this.index = deserialize.integer(payload.index);
        this.author = payload.author;
        this.body = payload.body;
        this.media = payload.media;
        this.attributes = payload.attributes;
        this.participantSid = payload.participant_sid;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated);
        this.url = payload.url;
        this.delivery = payload.delivery;
        this.links = payload.links;
        this.contentSid = payload.content_sid;
        this._solution = { conversationSid, sid: sid || this.sid };
    }
    get _proxy() {
        this._context =
            this._context ||
                new MessageContextImpl(this._version, this._solution.conversationSid, this._solution.sid);
        return this._context;
    }
    remove(params, callback) {
        return this._proxy.remove(params, callback);
    }
    /**
     * Fetch a MessageInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed MessageInstance
     */
    fetch(callback) {
        return this._proxy.fetch(callback);
    }
    update(params, callback) {
        return this._proxy.update(params, callback);
    }
    /**
     * Access the deliveryReceipts.
     */
    deliveryReceipts() {
        return this._proxy.deliveryReceipts;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            accountSid: this.accountSid,
            conversationSid: this.conversationSid,
            sid: this.sid,
            index: this.index,
            author: this.author,
            body: this.body,
            media: this.media,
            attributes: this.attributes,
            participantSid: this.participantSid,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated,
            url: this.url,
            delivery: this.delivery,
            links: this.links,
            contentSid: this.contentSid,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.MessageInstance = MessageInstance;
function MessageListInstance(version, conversationSid) {
    if (!(0, utility_1.isValidPathParam)(conversationSid)) {
        throw new Error("Parameter 'conversationSid' is not valid.");
    }
    const instance = ((sid) => instance.get(sid));
    instance.get = function get(sid) {
        return new MessageContextImpl(version, conversationSid, sid);
    };
    instance._version = version;
    instance._solution = { conversationSid };
    instance._uri = `/Conversations/${conversationSid}/Messages`;
    instance.create = function create(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        if (params["author"] !== undefined)
            data["Author"] = params["author"];
        if (params["body"] !== undefined)
            data["Body"] = params["body"];
        if (params["dateCreated"] !== undefined)
            data["DateCreated"] = serialize.iso8601DateTime(params["dateCreated"]);
        if (params["dateUpdated"] !== undefined)
            data["DateUpdated"] = serialize.iso8601DateTime(params["dateUpdated"]);
        if (params["attributes"] !== undefined)
            data["Attributes"] = params["attributes"];
        if (params["mediaSid"] !== undefined)
            data["MediaSid"] = params["mediaSid"];
        if (params["contentSid"] !== undefined)
            data["ContentSid"] = params["contentSid"];
        if (params["contentVariables"] !== undefined)
            data["ContentVariables"] = params["contentVariables"];
        if (params["subject"] !== undefined)
            data["Subject"] = params["subject"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        if (params["xTwilioWebhookEnabled"] !== undefined)
            headers["X-Twilio-Webhook-Enabled"] = params["xTwilioWebhookEnabled"];
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new MessageInstance(operationVersion, payload, instance._solution.conversationSid));
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
        if (params["order"] !== undefined)
            data["Order"] = params["order"];
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
        operationPromise = operationPromise.then((payload) => new MessagePage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new MessagePage(instance._version, payload, instance._solution));
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
exports.MessageListInstance = MessageListInstance;
class MessagePage extends Page_1.default {
    /**
     * Initialize the MessagePage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of MessageInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new MessageInstance(this._version, payload, this._solution.conversationSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.MessagePage = MessagePage;
