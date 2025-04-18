"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Numbers
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
const bulkEligibility_1 = require("./v1/bulkEligibility");
const eligibility_1 = require("./v1/eligibility");
const portingPortIn_1 = require("./v1/portingPortIn");
const portingPortInPhoneNumber_1 = require("./v1/portingPortInPhoneNumber");
const portingPortability_1 = require("./v1/portingPortability");
const portingWebhookConfiguration_1 = require("./v1/portingWebhookConfiguration");
const portingWebhookConfigurationDelete_1 = require("./v1/portingWebhookConfigurationDelete");
const signingRequestConfiguration_1 = require("./v1/signingRequestConfiguration");
const webhook_1 = require("./v1/webhook");
class V1 extends Version_1.default {
    /**
     * Initialize the V1 version of Numbers
     *
     * @param domain - The Twilio (Twilio.Numbers) domain
     */
    constructor(domain) {
        super(domain, "v1");
    }
    /** Getter for bulkEligibilities resource */
    get bulkEligibilities() {
        this._bulkEligibilities =
            this._bulkEligibilities || (0, bulkEligibility_1.BulkEligibilityListInstance)(this);
        return this._bulkEligibilities;
    }
    /** Getter for eligibilities resource */
    get eligibilities() {
        this._eligibilities = this._eligibilities || (0, eligibility_1.EligibilityListInstance)(this);
        return this._eligibilities;
    }
    /** Getter for portingPortIns resource */
    get portingPortIns() {
        this._portingPortIns =
            this._portingPortIns || (0, portingPortIn_1.PortingPortInListInstance)(this);
        return this._portingPortIns;
    }
    /** Getter for portingPortInPhoneNumber resource */
    get portingPortInPhoneNumber() {
        this._portingPortInPhoneNumber =
            this._portingPortInPhoneNumber ||
                (0, portingPortInPhoneNumber_1.PortingPortInPhoneNumberListInstance)(this);
        return this._portingPortInPhoneNumber;
    }
    /** Getter for portingPortabilities resource */
    get portingPortabilities() {
        this._portingPortabilities =
            this._portingPortabilities || (0, portingPortability_1.PortingPortabilityListInstance)(this);
        return this._portingPortabilities;
    }
    /** Getter for portingWebhookConfigurations resource */
    get portingWebhookConfigurations() {
        this._portingWebhookConfigurations =
            this._portingWebhookConfigurations ||
                (0, portingWebhookConfiguration_1.PortingWebhookConfigurationListInstance)(this);
        return this._portingWebhookConfigurations;
    }
    /** Getter for portingWebhookConfigurationsDelete resource */
    get portingWebhookConfigurationsDelete() {
        this._portingWebhookConfigurationsDelete =
            this._portingWebhookConfigurationsDelete ||
                (0, portingWebhookConfigurationDelete_1.PortingWebhookConfigurationDeleteListInstance)(this);
        return this._portingWebhookConfigurationsDelete;
    }
    /** Getter for signingRequestConfigurations resource */
    get signingRequestConfigurations() {
        this._signingRequestConfigurations =
            this._signingRequestConfigurations ||
                (0, signingRequestConfiguration_1.SigningRequestConfigurationListInstance)(this);
        return this._signingRequestConfigurations;
    }
    /** Getter for webhook resource */
    get webhook() {
        this._webhook = this._webhook || (0, webhook_1.WebhookListInstance)(this);
        return this._webhook;
    }
}
exports.default = V1;
