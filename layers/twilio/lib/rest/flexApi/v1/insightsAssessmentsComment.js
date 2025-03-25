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
exports.InsightsAssessmentsCommentPage = exports.InsightsAssessmentsCommentInstance = exports.InsightsAssessmentsCommentListInstance = void 0;
const util_1 = require("util");
const Page_1 = __importDefault(require("../../../base/Page"));
const deserialize = require("../../../base/deserialize");
const serialize = require("../../../base/serialize");
function InsightsAssessmentsCommentListInstance(version) {
    const instance = {};
    instance._version = version;
    instance._solution = {};
    instance._uri = `/Insights/QualityManagement/Assessments/Comments`;
    instance.create = function create(params, callback) {
        if (params === null || params === undefined) {
            throw new Error('Required parameter "params" missing.');
        }
        if (params["categoryId"] === null || params["categoryId"] === undefined) {
            throw new Error("Required parameter \"params['categoryId']\" missing.");
        }
        if (params["categoryName"] === null ||
            params["categoryName"] === undefined) {
            throw new Error("Required parameter \"params['categoryName']\" missing.");
        }
        if (params["comment"] === null || params["comment"] === undefined) {
            throw new Error("Required parameter \"params['comment']\" missing.");
        }
        if (params["segmentId"] === null || params["segmentId"] === undefined) {
            throw new Error("Required parameter \"params['segmentId']\" missing.");
        }
        if (params["agentId"] === null || params["agentId"] === undefined) {
            throw new Error("Required parameter \"params['agentId']\" missing.");
        }
        if (params["offset"] === null || params["offset"] === undefined) {
            throw new Error("Required parameter \"params['offset']\" missing.");
        }
        let data = {};
        data["CategoryId"] = params["categoryId"];
        data["CategoryName"] = params["categoryName"];
        data["Comment"] = params["comment"];
        data["SegmentId"] = params["segmentId"];
        data["AgentId"] = params["agentId"];
        data["Offset"] = params["offset"];
        const headers = {};
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Accept"] = "application/json";
        if (params["authorization"] !== undefined)
            headers["Authorization"] = params["authorization"];
        let operationVersion = version, operationPromise = operationVersion.create({
            uri: instance._uri,
            method: "post",
            data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new InsightsAssessmentsCommentInstance(operationVersion, payload));
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
        if (params["segmentId"] !== undefined)
            data["SegmentId"] = params["segmentId"];
        if (params["agentId"] !== undefined)
            data["AgentId"] = params["agentId"];
        if (params["pageSize"] !== undefined)
            data["PageSize"] = params["pageSize"];
        if (params.pageNumber !== undefined)
            data["Page"] = params.pageNumber;
        if (params.pageToken !== undefined)
            data["PageToken"] = params.pageToken;
        const headers = {};
        headers["Accept"] = "application/json";
        if (params["authorization"] !== undefined)
            headers["Authorization"] = params["authorization"];
        let operationVersion = version, operationPromise = operationVersion.page({
            uri: instance._uri,
            method: "get",
            params: data,
            headers,
        });
        operationPromise = operationPromise.then((payload) => new InsightsAssessmentsCommentPage(operationVersion, payload, instance._solution));
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
        let pagePromise = operationPromise.then((payload) => new InsightsAssessmentsCommentPage(instance._version, payload, instance._solution));
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
exports.InsightsAssessmentsCommentListInstance = InsightsAssessmentsCommentListInstance;
class InsightsAssessmentsCommentInstance {
    constructor(_version, payload) {
        this._version = _version;
        this.accountSid = payload.account_sid;
        this.assessmentSid = payload.assessment_sid;
        this.comment = payload.comment;
        this.offset = payload.offset;
        this.report = payload.report;
        this.weight = payload.weight;
        this.agentId = payload.agent_id;
        this.segmentId = payload.segment_id;
        this.userName = payload.user_name;
        this.userEmail = payload.user_email;
        this.timestamp = payload.timestamp;
        this.url = payload.url;
    }
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON() {
        return {
            accountSid: this.accountSid,
            assessmentSid: this.assessmentSid,
            comment: this.comment,
            offset: this.offset,
            report: this.report,
            weight: this.weight,
            agentId: this.agentId,
            segmentId: this.segmentId,
            userName: this.userName,
            userEmail: this.userEmail,
            timestamp: this.timestamp,
            url: this.url,
        };
    }
    [util_1.inspect.custom](_depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.InsightsAssessmentsCommentInstance = InsightsAssessmentsCommentInstance;
class InsightsAssessmentsCommentPage extends Page_1.default {
    /**
     * Initialize the InsightsAssessmentsCommentPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version, response, solution) {
        super(version, response, solution);
    }
    /**
     * Build an instance of InsightsAssessmentsCommentInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload) {
        return new InsightsAssessmentsCommentInstance(this._version, payload);
    }
    [util_1.inspect.custom](depth, options) {
        return (0, util_1.inspect)(this.toJSON(), options);
    }
}
exports.InsightsAssessmentsCommentPage = InsightsAssessmentsCommentPage;
