"use strict";
/*
 * This code was generated by
 * ___ _ _ _ _ _    _ ____    ____ ____ _    ____ ____ _  _ ____ ____ ____ ___ __   __
 *  |  | | | | |    | |  | __ |  | |__| | __ | __ |___ |\ | |___ |__/ |__|  | |  | |__/
 *  |  |_|_| | |___ | |__|    |__| |  | |    |__] |___ | \| |___ |  \ |  |  | |__| |  \
 *
 * Twilio - Marketplace
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
const availableAddOn_1 = require("./v1/availableAddOn");
const installedAddOn_1 = require("./v1/installedAddOn");
const moduleData_1 = require("./v1/moduleData");
const moduleDataManagement_1 = require("./v1/moduleDataManagement");
const referralConversion_1 = require("./v1/referralConversion");
class V1 extends Version_1.default {
    /**
     * Initialize the V1 version of Marketplace
     *
     * @param domain - The Twilio (Twilio.Marketplace) domain
     */
    constructor(domain) {
        super(domain, "v1");
    }
    /** Getter for availableAddOns resource */
    get availableAddOns() {
        this._availableAddOns =
            this._availableAddOns || (0, availableAddOn_1.AvailableAddOnListInstance)(this);
        return this._availableAddOns;
    }
    /** Getter for installedAddOns resource */
    get installedAddOns() {
        this._installedAddOns =
            this._installedAddOns || (0, installedAddOn_1.InstalledAddOnListInstance)(this);
        return this._installedAddOns;
    }
    /** Getter for moduleData resource */
    get moduleData() {
        this._moduleData = this._moduleData || (0, moduleData_1.ModuleDataListInstance)(this);
        return this._moduleData;
    }
    /** Getter for moduleDataManagement resource */
    get moduleDataManagement() {
        this._moduleDataManagement =
            this._moduleDataManagement || (0, moduleDataManagement_1.ModuleDataManagementListInstance)(this);
        return this._moduleDataManagement;
    }
    /** Getter for referralConversion resource */
    get referralConversion() {
        this._referralConversion =
            this._referralConversion || (0, referralConversion_1.ReferralConversionListInstance)(this);
        return this._referralConversion;
    }
}
exports.default = V1;
