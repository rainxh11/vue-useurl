import { Ref, UnwrapRef, ComputedRef } from 'vue-demi';
export declare type MaybeRef<T> = T | Ref<T>;
export declare type MaybeReactive<T> = T | UnwrapRef<T>;
export declare type IQueryParams = Record<string, null | undefined | string | number | string[] | (string | number)[] | Ref<any> | UnwrapRef<any>>;
export declare type IPathVariables = Record<string, string | number | Ref<any>>;
export interface IUrlOptions {
    path?: MaybeRef<string | number>;
    pathVariables?: MaybeReactive<IPathVariables>;
    queryParams?: MaybeReactive<IQueryParams>;
    disableCSV?: MaybeRef<boolean>;
    hash?: MaybeRef<string | number>;
}
export interface IBuilderResult {
    path: Ref<string>;
    hash: Ref<string | number>;
    queryParams: UnwrapRef<IQueryParams>;
    pathVariables: UnwrapRef<IPathVariables>;
    url: ComputedRef<string>;
    disableCSV: Ref<boolean>;
    setUrl: (url: ComputedRef<string>) => void;
}
export declare class BuilderResult implements IBuilderResult {
    constructor(path: MaybeRef<string | number>, pathVariables: MaybeReactive<IPathVariables>, queryParams: MaybeReactive<IQueryParams>, hash: MaybeRef<string | number>, disableCSV: MaybeRef<boolean>);
    setUrl(url: ComputedRef<string>): void;
    path: Ref<string>;
    hash: Ref<string | number>;
    queryParams: UnwrapRef<IQueryParams>;
    pathVariables: UnwrapRef<IPathVariables>;
    url: ComputedRef<string>;
    disableCSV: Ref<boolean>;
}
export declare class UrlBuilder {
    baseUrl: string;
    constructor(baseUrl?: string | null | undefined);
    buildHash(url: string, hash: string | number): string;
    buildPathVariables(url: string, pathVariables: IPathVariables): string;
    buildQueryParams(url: string, queryParams: IQueryParams, disableCSV?: boolean): string;
    buildCSV(key: string, param: any, disableCSV: boolean): string[] | any[];
}
/**
 * Create a reactive url
 * @param {IUrlOptions | any} options Builder Options
 * @param {string} baseUrl Base URL
 * @returns {IBuilderResult} `{
 * url,
 * queryParams,
 * pathVariables,
 * hash,
 * path,
 * disableCSV
 * }`
 */
declare const useUrl: (options: IUrlOptions | any, baseUrl?: string | undefined) => IBuilderResult;
/**
 * Create a new instance of useUrl()
 * @returns {function} Instance function
 */
declare const createUseUrlInstance: () => (options: IUrlOptions | any, baseUrl?: string | undefined) => IBuilderResult;
export { useUrl, createUseUrlInstance };
