import NumbersBase from "../NumbersBase";
import Version from "../../base/Version";
import { BulkEligibilityListInstance } from "./v1/bulkEligibility";
import { EligibilityListInstance } from "./v1/eligibility";
import { PortingPortInListInstance } from "./v1/portingPortIn";
import { PortingPortInPhoneNumberListInstance } from "./v1/portingPortInPhoneNumber";
import { PortingPortabilityListInstance } from "./v1/portingPortability";
import { PortingWebhookConfigurationListInstance } from "./v1/portingWebhookConfiguration";
import { PortingWebhookConfigurationDeleteListInstance } from "./v1/portingWebhookConfigurationDelete";
import { SigningRequestConfigurationListInstance } from "./v1/signingRequestConfiguration";
import { WebhookListInstance } from "./v1/webhook";
export default class V1 extends Version {
    /**
     * Initialize the V1 version of Numbers
     *
     * @param domain - The Twilio (Twilio.Numbers) domain
     */
    constructor(domain: NumbersBase);
    /** bulkEligibilities - { Twilio.Numbers.V1.BulkEligibilityListInstance } resource */
    protected _bulkEligibilities?: BulkEligibilityListInstance;
    /** eligibilities - { Twilio.Numbers.V1.EligibilityListInstance } resource */
    protected _eligibilities?: EligibilityListInstance;
    /** portingPortIns - { Twilio.Numbers.V1.PortingPortInListInstance } resource */
    protected _portingPortIns?: PortingPortInListInstance;
    /** portingPortInPhoneNumber - { Twilio.Numbers.V1.PortingPortInPhoneNumberListInstance } resource */
    protected _portingPortInPhoneNumber?: PortingPortInPhoneNumberListInstance;
    /** portingPortabilities - { Twilio.Numbers.V1.PortingPortabilityListInstance } resource */
    protected _portingPortabilities?: PortingPortabilityListInstance;
    /** portingWebhookConfigurations - { Twilio.Numbers.V1.PortingWebhookConfigurationListInstance } resource */
    protected _portingWebhookConfigurations?: PortingWebhookConfigurationListInstance;
    /** portingWebhookConfigurationsDelete - { Twilio.Numbers.V1.PortingWebhookConfigurationDeleteListInstance } resource */
    protected _portingWebhookConfigurationsDelete?: PortingWebhookConfigurationDeleteListInstance;
    /** signingRequestConfigurations - { Twilio.Numbers.V1.SigningRequestConfigurationListInstance } resource */
    protected _signingRequestConfigurations?: SigningRequestConfigurationListInstance;
    /** webhook - { Twilio.Numbers.V1.WebhookListInstance } resource */
    protected _webhook?: WebhookListInstance;
    /** Getter for bulkEligibilities resource */
    get bulkEligibilities(): BulkEligibilityListInstance;
    /** Getter for eligibilities resource */
    get eligibilities(): EligibilityListInstance;
    /** Getter for portingPortIns resource */
    get portingPortIns(): PortingPortInListInstance;
    /** Getter for portingPortInPhoneNumber resource */
    get portingPortInPhoneNumber(): PortingPortInPhoneNumberListInstance;
    /** Getter for portingPortabilities resource */
    get portingPortabilities(): PortingPortabilityListInstance;
    /** Getter for portingWebhookConfigurations resource */
    get portingWebhookConfigurations(): PortingWebhookConfigurationListInstance;
    /** Getter for portingWebhookConfigurationsDelete resource */
    get portingWebhookConfigurationsDelete(): PortingWebhookConfigurationDeleteListInstance;
    /** Getter for signingRequestConfigurations resource */
    get signingRequestConfigurations(): SigningRequestConfigurationListInstance;
    /** Getter for webhook resource */
    get webhook(): WebhookListInstance;
}
