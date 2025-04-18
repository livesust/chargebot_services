/// <reference types="node" />
import { inspect, InspectOptions } from "util";
import V2010 from "../../../V2010";
export type TranscriptionStatus = "in-progress" | "stopped";
export type TranscriptionTrack = "inbound_track" | "outbound_track" | "both_tracks";
export type TranscriptionUpdateStatus = "stopped";
/**
 * Options to pass to update a TranscriptionInstance
 */
export interface TranscriptionContextUpdateOptions {
    /**  */
    status: TranscriptionUpdateStatus;
}
/**
 * Options to pass to create a TranscriptionInstance
 */
export interface TranscriptionListInstanceCreateOptions {
    /** The user-specified name of this Transcription, if one was given when the Transcription was created. This may be used to stop the Transcription. */
    name?: string;
    /**  */
    track?: TranscriptionTrack;
    /** Absolute URL of the status callback. */
    statusCallbackUrl?: string;
    /** The http method for the status_callback (one of GET, POST). */
    statusCallbackMethod?: string;
    /** Friendly name given to the Inbound Track */
    inboundTrackLabel?: string;
    /** Friendly name given to the Outbound Track */
    outboundTrackLabel?: string;
    /** Indicates if partial results are going to be sent to the customer */
    partialResults?: boolean;
    /** Language code used by the transcription engine, specified in [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) format */
    languageCode?: string;
    /** Definition of the transcription engine to be used, among those supported by Twilio */
    transcriptionEngine?: string;
    /** indicates if the server will attempt to filter out profanities, replacing all but the initial character in each filtered word with asterisks */
    profanityFilter?: boolean;
    /** Recognition model used by the transcription engine, among those supported by the provider */
    speechModel?: string;
    /** A Phrase contains words and phrase \\\"hints\\\" so that the speech recognition engine is more likely to recognize them. */
    hints?: string;
    /** The provider will add punctuation to recognition result */
    enableAutomaticPunctuation?: boolean;
    /** The SID of the [Voice Intelligence Service](https://www.twilio.com/docs/voice/intelligence/api/service-resource) for persisting transcripts and running post-call Language Operators . */
    intelligenceService?: string;
}
export interface TranscriptionContext {
    /**
     * Update a TranscriptionInstance
     *
     * @param params - Parameter for request
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed TranscriptionInstance
     */
    update(params: TranscriptionContextUpdateOptions, callback?: (error: Error | null, item?: TranscriptionInstance) => any): Promise<TranscriptionInstance>;
    /**
     * Provide a user-friendly representation
     */
    toJSON(): any;
    [inspect.custom](_depth: any, options: InspectOptions): any;
}
export interface TranscriptionContextSolution {
    accountSid: string;
    callSid: string;
    sid: string;
}
export declare class TranscriptionContextImpl implements TranscriptionContext {
    protected _version: V2010;
    protected _solution: TranscriptionContextSolution;
    protected _uri: string;
    constructor(_version: V2010, accountSid: string, callSid: string, sid: string);
    update(params: TranscriptionContextUpdateOptions, callback?: (error: Error | null, item?: TranscriptionInstance) => any): Promise<TranscriptionInstance>;
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON(): TranscriptionContextSolution;
    [inspect.custom](_depth: any, options: InspectOptions): string;
}
interface TranscriptionResource {
    sid: string;
    account_sid: string;
    call_sid: string;
    name: string;
    status: TranscriptionStatus;
    date_updated: Date;
    uri: string;
}
export declare class TranscriptionInstance {
    protected _version: V2010;
    protected _solution: TranscriptionContextSolution;
    protected _context?: TranscriptionContext;
    constructor(_version: V2010, payload: TranscriptionResource, accountSid: string, callSid: string, sid?: string);
    /**
     * The SID of the Transcription resource.
     */
    sid: string;
    /**
     * The SID of the [Account](https://www.twilio.com/docs/iam/api/account) that created this Transcription resource.
     */
    accountSid: string;
    /**
     * The SID of the [Call](https://www.twilio.com/docs/voice/api/call-resource) the Transcription resource is associated with.
     */
    callSid: string;
    /**
     * The user-specified name of this Transcription, if one was given when the Transcription was created. This may be used to stop the Transcription.
     */
    name: string;
    status: TranscriptionStatus;
    /**
     * The date and time in GMT that this resource was last updated, specified in [RFC 2822](https://www.ietf.org/rfc/rfc2822.txt) format.
     */
    dateUpdated: Date;
    uri: string;
    private get _proxy();
    /**
     * Update a TranscriptionInstance
     *
     * @param params - Parameter for request
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed TranscriptionInstance
     */
    update(params: TranscriptionContextUpdateOptions, callback?: (error: Error | null, item?: TranscriptionInstance) => any): Promise<TranscriptionInstance>;
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON(): {
        sid: string;
        accountSid: string;
        callSid: string;
        name: string;
        status: TranscriptionStatus;
        dateUpdated: Date;
        uri: string;
    };
    [inspect.custom](_depth: any, options: InspectOptions): string;
}
export interface TranscriptionSolution {
    accountSid: string;
    callSid: string;
}
export interface TranscriptionListInstance {
    _version: V2010;
    _solution: TranscriptionSolution;
    _uri: string;
    (sid: string): TranscriptionContext;
    get(sid: string): TranscriptionContext;
    /**
     * Create a TranscriptionInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed TranscriptionInstance
     */
    create(callback?: (error: Error | null, item?: TranscriptionInstance) => any): Promise<TranscriptionInstance>;
    /**
     * Create a TranscriptionInstance
     *
     * @param params - Parameter for request
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed TranscriptionInstance
     */
    create(params: TranscriptionListInstanceCreateOptions, callback?: (error: Error | null, item?: TranscriptionInstance) => any): Promise<TranscriptionInstance>;
    /**
     * Provide a user-friendly representation
     */
    toJSON(): any;
    [inspect.custom](_depth: any, options: InspectOptions): any;
}
export declare function TranscriptionListInstance(version: V2010, accountSid: string, callSid: string): TranscriptionListInstance;
export {};
