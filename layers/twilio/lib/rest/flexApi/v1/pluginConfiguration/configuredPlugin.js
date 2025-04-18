"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Flex
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
exports.ConfiguredPluginPage = exports.ConfiguredPluginListInstance = exports.ConfiguredPluginInstance = exports.ConfiguredPluginContextImpl = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../../base/Page"));
const deserialize = require("../../../../base/deserialize");
const serialize = require("../../../../base/serialize");
const utility_1 = require("../../../../base/utility");
class ConfiguredPluginContextImpl {
    constructor(_version, configurationSid, pluginSid) {
        this._version = _version;
        if (!(0, utility_1.isValidPathParam)(configurationSid)) {
            throw new Error("Parameter 'configurationSid' is not valid.");
        }
        if (!(0, utility_1.isValidPathParam)(pluginSid)) {
            throw new Error("Parameter 'pluginSid' is not valid.");
        }
        this._solution = { configurationSid, pluginSid };
        this._uri = `/PluginService/Configurations/${configurationSid}/Plugins/${pluginSid}`;
    }
    fetch(params, callback) {
        if (params instanceof Function) {
            callback = params;
            params = {};
        }
        else {
            params = params || {};
        }
        let data = {};
        const headers = {};
        headers["Accept"] = "application/json";
        if (params["flexMetadata"] !== undefined)
            headers["Flex-Metadata"] = params["flexMetadata"];
        const instance = this;
        let operationVersion = instance._version, operationPromise = operationVersion.fetch({
            uri: instance._uri,
            method: "get",
            params: data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new ConfiguredPluginInstance(operationVersion, payload, instance._solution.configurationSid, instance._solution.pluginSid));
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
exports.ConfiguredPluginContextImpl = ConfiguredPluginContextImpl;
class ConfiguredPluginInstance {
    constructor(_version, payload, configurationSid, pluginSid) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.configurationSid = payload.configuration_sid;
        this.pluginSid = payload.plugin_sid;
        this.pluginVersionSid = payload.plugin_version_sid;
        this.phase = deserialize.integer(payload.phase);
        this.pluginUrl = payload.plugin_url;
        this.uniqueName = payload.unique_name;
        this.friendlyName = payload.friendly_name;
        this.description = payload.description;
        this.pluginArchived = payload.plugin_archived;
        this.version = payload.version;
        this.changelog = payload.changelog;
        this.pluginVersionArchived = payload.plugin_version_archived;
        this._private = payload.private;
        this.dateCreated = deserialize.iso8601DateTime(payload.date_created);
        this.url = payload.url;
        this._solution = {
            configurationSid,
            pluginSid: pluginSid || this.pluginSid,
        };
    }
    get _proxy() {
        this._context =
            this._context ||
                new ConfiguredPluginContextImpl(this._version, this._solution.configurationSid, this._solution.pluginSid);
        return this._context;
    }
    fetch(params, callback) {
        return this._proxy.fetch(params, callback);
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            accountSid: this.accountSid,
            configurationSid: this.configurationSid,
            pluginSid: this.pluginSid,
            pluginVersionSid: this.pluginVersionSid,
            phase: this.phase,
            pluginUrl: this.pluginUrl,
            uniqueName: this.uniqueName,
            friendlyName: this.friendlyName,
            description: this.description,
            pluginArchived: this.pluginArchived,
            version: this.version,
            changelog: this.changelog,
            pluginVersionArchived: this.pluginVersionArchived,
            _private: this._private,
            dateCreated: this.dateCreated,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.ConfiguredPluginInstance = ConfiguredPluginInstance;
function ConfiguredPluginListInstance(version, configurationSid) {
    if (!(0, utility_1.isValidPathParam)(configurationSid)) {
        throw new Error("Parameter 'configurationSid' is not valid.");
    }
    const instance = ((pluginSid) => instance.get(pluginSid));
    instance.get = function get(pluginSid) {
        return new ConfiguredPluginContextImpl(version, configurationSid, pluginSid);
    };
    instance._version = version;
    instance._solution = { configurationSid };
    instance._uri = `/PluginService/Configurations/${configurationSid}/Plugins`;
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
        if (params["flexMetadata"] !== undefined)
            headers["Flex-Metadata"] = params["flexMetadata"];
        let operationVersion = version, operationPromise = operationVersion.page({
            uri: instance._uri,
            method: "get",
            params: data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new ConfiguredPluginPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new ConfiguredPluginPage(instance._version, payload, instance._solution));
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
exports.ConfiguredPluginListInstance = ConfiguredPluginListInstance;
class ConfiguredPluginPage extends Page_1.default {
    /**
     * Initialize the ConfiguredPluginPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of ConfiguredPluginInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new ConfiguredPluginInstance(this._version, payload, this._solution.configurationSid);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.ConfiguredPluginPage = ConfiguredPluginPage;
