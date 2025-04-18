"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Assistants
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
const Version_1 = __importDefault(require("../../base/Version"));
const assistant_1 = require("./v1/assistant");
const knowledge_1 = require("./v1/knowledge");
const policy_1 = require("./v1/policy");
const session_1 = require("./v1/session");
const tool_1 = require("./v1/tool");
class V1 extends Version_1.default {
    /**
     * Initialize the V1 version of Assistants
     *
     * @param domain - The Twilio (Twilio.Assistants) domain
     */
    constructor(domain) {
        super(domain, "v1");
    }
    /** Getter for assistants resource */
    get assistants() {
        this._assistants = this._assistants || (0, assistant_1.AssistantListInstance)(this);
        return this._assistants;
    }
    /** Getter for knowledge resource */
    get knowledge() {
        this._knowledge = this._knowledge || (0, knowledge_1.KnowledgeListInstance)(this);
        return this._knowledge;
    }
    /** Getter for policies resource */
    get policies() {
        this._policies = this._policies || (0, policy_1.PolicyListInstance)(this);
        return this._policies;
    }
    /** Getter for sessions resource */
    get sessions() {
        this._sessions = this._sessions || (0, session_1.SessionListInstance)(this);
        return this._sessions;
    }
    /** Getter for tools resource */
    get tools() {
        this._tools = this._tools || (0, tool_1.ToolListInstance)(this);
        return this._tools;
    }
}
exports.default = V1;
