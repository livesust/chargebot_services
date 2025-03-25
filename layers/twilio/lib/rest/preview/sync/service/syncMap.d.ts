/// <reference types="node" />
import { inspect, InspectOptions } from "util";
import Page, { TwilioResponsePayload } from "../../../../base/Page";
import Response from "../../../../http/response";
import Sync from "../../Sync";
import { SyncMapItemListInstance } from "./syncMap/syncMapItem";
import { SyncMapPermissionListInstance } from "./syncMap/syncMapPermission";
/**
 * Options to pass to create a SyncMapInstance
 */
export interface SyncMapListInstanceCreateOptions {
    /**  */
    uniqueName?: string;
}
/**
 * Options to pass to each
 */
export interface SyncMapListInstanceEachOptions {
    /** How many resources to return in each list page. The default is 50, and the maximum is 1000. */
    pageSize?: number;
    /** Function to process each record. If this and a positional callback are passed, this one will be used */
    callback?: (item: SyncMapInstance, done: (err?: Error) => void) => void;
    /** Function to be called upon completion of streaming */
    done?: Function;
    /** Upper limit for the number of records to return. each() guarantees never to return more than limit. Default is no limit */
    limit?: number;
}
/**
 * Options to pass to list
 */
export interface SyncMapListInstanceOptions {
    /** How many resources to return in each list page. The default is 50, and the maximum is 1000. */
    pageSize?: number;
    /** Upper limit for the number of records to return. list() guarantees never to return more than limit. Default is no limit */
    limit?: number;
}
/**
 * Options to pass to page
 */
export interface SyncMapListInstancePageOptions {
    /** How many resources to return in each list page. The default is 50, and the maximum is 1000. */
    pageSize?: number;
    /** Page Number, this value is simply for client state */
    pageNumber?: number;
    /** PageToken provided by the API */
    pageToken?: string;
}
export interface SyncMapContext {
    syncMapItems: SyncMapItemListInstance;
    syncMapPermissions: SyncMapPermissionListInstance;
    /**
     * Remove a SyncMapInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed boolean
     */
    remove(callback?: (error: Error | null, item?: boolean) => any): Promise<boolean>;
    /**
     * Fetch a SyncMapInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed SyncMapInstance
     */
    fetch(callback?: (error: Error | null, item?: SyncMapInstance) => any): Promise<SyncMapInstance>;
    /**
     * Provide a user-friendly representation
     */
    toJSON(): any;
    [inspect.custom](_depth: any, options: InspectOptions): any;
}
export interface SyncMapContextSolution {
    serviceSid: string;
    sid: string;
}
export declare class SyncMapContextImpl implements SyncMapContext {
    protected _version: Sync;
    protected _solution: SyncMapContextSolution;
    protected _uri: string;
    protected _syncMapItems?: SyncMapItemListInstance;
    protected _syncMapPermissions?: SyncMapPermissionListInstance;
    constructor(_version: Sync, serviceSid: string, sid: string);
    get syncMapItems(): SyncMapItemListInstance;
    get syncMapPermissions(): SyncMapPermissionListInstance;
    remove(callback?: (error: Error | null, item?: boolean) => any): Promise<boolean>;
    fetch(callback?: (error: Error | null, item?: SyncMapInstance) => any): Promise<SyncMapInstance>;
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON(): SyncMapContextSolution;
    [inspect.custom](_depth: any, options: InspectOptions): string;
}
interface SyncMapPayload extends TwilioResponsePayload {
    maps: SyncMapResource[];
}
interface SyncMapResource {
    sid: string;
    unique_name: string;
    account_sid: string;
    service_sid: string;
    url: string;
    links: Record<string, string>;
    revision: string;
    date_created: Date;
    date_updated: Date;
    created_by: string;
}
export declare class SyncMapInstance {
    protected _version: Sync;
    protected _solution: SyncMapContextSolution;
    protected _context?: SyncMapContext;
    constructor(_version: Sync, payload: SyncMapResource, serviceSid: string, sid?: string);
    sid: string;
    uniqueName: string;
    accountSid: string;
    serviceSid: string;
    url: string;
    links: Record<string, string>;
    revision: string;
    dateCreated: Date;
    dateUpdated: Date;
    createdBy: string;
    private get _proxy();
    /**
     * Remove a SyncMapInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed boolean
     */
    remove(callback?: (error: Error | null, item?: boolean) => any): Promise<boolean>;
    /**
     * Fetch a SyncMapInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed SyncMapInstance
     */
    fetch(callback?: (error: Error | null, item?: SyncMapInstance) => any): Promise<SyncMapInstance>;
    /**
     * Access the syncMapItems.
     */
    syncMapItems(): SyncMapItemListInstance;
    /**
     * Access the syncMapPermissions.
     */
    syncMapPermissions(): SyncMapPermissionListInstance;
    /**
     * Provide a user-friendly representation
     *
     * @returns Object
     */
    toJSON(): {
        sid: string;
        uniqueName: string;
        accountSid: string;
        serviceSid: string;
        url: string;
        links: Record<string, string>;
        revision: string;
        dateCreated: Date;
        dateUpdated: Date;
        createdBy: string;
    };
    [inspect.custom](_depth: any, options: InspectOptions): string;
}
export interface SyncMapSolution {
    serviceSid: string;
}
export interface SyncMapListInstance {
    _version: Sync;
    _solution: SyncMapSolution;
    _uri: string;
    (sid: string): SyncMapContext;
    get(sid: string): SyncMapContext;
    /**
     * Create a SyncMapInstance
     *
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed SyncMapInstance
     */
    create(callback?: (error: Error | null, item?: SyncMapInstance) => any): Promise<SyncMapInstance>;
    /**
     * Create a SyncMapInstance
     *
     * @param params - Parameter for request
     * @param callback - Callback to handle processed record
     *
     * @returns Resolves to processed SyncMapInstance
     */
    create(params: SyncMapListInstanceCreateOptions, callback?: (error: Error | null, item?: SyncMapInstance) => any): Promise<SyncMapInstance>;
    /**
     * Streams SyncMapInstance records from the API.
     *
     * This operation lazily loads records as efficiently as possible until the limit
     * is reached.
     *
     * The results are passed into the callback function, so this operation is memory
     * efficient.
     *
     * If a function is passed as the first argument, it will be used as the callback
     * function.
     *
     * @param { SyncMapListInstanceEachOptions } [params] - Options for request
     * @param { function } [callback] - Function to process each record
     */
    each(callback?: (item: SyncMapInstance, done: (err?: Error) => void) => void): void;
    each(params: SyncMapListInstanceEachOptions, callback?: (item: SyncMapInstance, done: (err?: Error) => void) => void): void;
    /**
     * Retrieve a single target page of SyncMapInstance records from the API.
     *
     * The request is executed immediately.
     *
     * @param { string } [targetUrl] - API-generated URL for the requested results page
     * @param { function } [callback] - Callback to handle list of records
     */
    getPage(targetUrl: string, callback?: (error: Error | null, items: SyncMapPage) => any): Promise<SyncMapPage>;
    /**
     * Lists SyncMapInstance records from the API as a list.
     *
     * If a function is passed as the first argument, it will be used as the callback
     * function.
     *
     * @param { SyncMapListInstanceOptions } [params] - Options for request
     * @param { function } [callback] - Callback to handle list of records
     */
    list(callback?: (error: Error | null, items: SyncMapInstance[]) => any): Promise<SyncMapInstance[]>;
    list(params: SyncMapListInstanceOptions, callback?: (error: Error | null, items: SyncMapInstance[]) => any): Promise<SyncMapInstance[]>;
    /**
     * Retrieve a single page of SyncMapInstance records from the API.
     *
     * The request is executed immediately.
     *
     * If a function is passed as the first argument, it will be used as the callback
     * function.
     *
     * @param { SyncMapListInstancePageOptions } [params] - Options for request
     * @param { function } [callback] - Callback to handle list of records
     */
    page(callback?: (error: Error | null, items: SyncMapPage) => any): Promise<SyncMapPage>;
    page(params: SyncMapListInstancePageOptions, callback?: (error: Error | null, items: SyncMapPage) => any): Promise<SyncMapPage>;
    /**
     * Provide a user-friendly representation
     */
    toJSON(): any;
    [inspect.custom](_depth: any, options: InspectOptions): any;
}
export declare function SyncMapListInstance(version: Sync, serviceSid: string): SyncMapListInstance;
export declare class SyncMapPage extends Page<Sync, SyncMapPayload, SyncMapResource, SyncMapInstance> {
    /**
     * Initialize the SyncMapPage
     *
     * @param version - Version of the resource
     * @param response - Response from the API
     * @param solution - Path solution
     */
    constructor(version: Sync, response: Response<string>, solution: SyncMapSolution);
    /**
     * Build an instance of SyncMapInstance
     *
     * @param payload - Payload response from the API
     */
    getInstance(payload: SyncMapResource): SyncMapInstance;
    [inspect.custom](depth: any, options: InspectOptions): string;
}
export {};
