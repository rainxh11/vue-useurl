import { ref, reactive, computed, Ref, UnwrapRef, ComputedRef, install, isReactive } from 'vue-demi';

install();

export type MaybeRef<T> = T | Ref<T>;
export type MaybeReactive<T> = T | UnwrapRef<T>;

export type IQueryParams = Record<
  string,
  null | undefined | string | number | string[] | (string | number)[] | Ref<any> | UnwrapRef<any>
>;

export type IPathVariables = Record<string, string | number | Ref<any>>;

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

export class BuilderResult implements IBuilderResult {
  constructor(
    path: MaybeRef<string | number>,
    pathVariables: MaybeReactive<IPathVariables>,
    queryParams: MaybeReactive<IQueryParams>,
    hash: MaybeRef<string | number>,
    disableCSV: MaybeRef<boolean>,
  ) {
    this.path = isReactive(path) ? (path as Ref) : ref(path.toString());
    this.hash = isReactive(hash) ? (hash as Ref) : ref(hash.toString());
    this.queryParams = isReactive(queryParams) ? queryParams : reactive(queryParams);
    this.pathVariables = isReactive(pathVariables) ? pathVariables : reactive(pathVariables);
    this.disableCSV = isReactive(disableCSV) ? (disableCSV as Ref) : ref(disableCSV);
    this.url = computed(() => '');
  }
  setUrl(url: ComputedRef<string>): void {
    this.url = url;
  }
  path: Ref<string>;
  hash: Ref<string | number>;
  queryParams: UnwrapRef<IQueryParams>;
  pathVariables: UnwrapRef<IPathVariables>;
  url: ComputedRef<string>;
  disableCSV: Ref<boolean>;
}

export class UrlBuilder {
  baseUrl: string;

  constructor(baseUrl?: string | null | undefined) {
    this.baseUrl = baseUrl ?? '';
  }
  public buildHash(url: string, hash: string | number): string {
    if (url.match(/#.+/gi)) return url.replace(/#.+/gi, `#${hash}`);
    return `${url}#${hash}`;
  }
  public buildPathVariables(url: string, pathVariables: IPathVariables): string {
    for (const key in Object.keys(pathVariables)) {
      url = url.replace(/:([^\/]+)/gi, key);
    }
    return url;
  }
  public buildQueryParams(url: string, queryParams: IQueryParams, disableCSV = false): string {
    url = url.replace(/(\?|\&)([^=]+)\=([^&]+)/gi, '');
    const params = Object.keys(queryParams)
      .map((key, index) => {
        const param = Object.values(queryParams)[index];
        switch (typeof key) {
          default:
            return `${key}=${param}`;
          case 'object':
            return this.buildCSV(key, param, disableCSV);
        }
      })
      .flat()
      .filter((x) => x !== null);
    const paramsString = params.length > 0 ? `?${params.join('&')}` : '';
    return url + paramsString;
  }
  public buildCSV(key: string, param: any, disableCSV: boolean): string[] | any[] {
    if (Array.isArray(param)) {
      if (disableCSV) {
        return param.map((p) => `${key}=${p}`);
      }
      return [`${key}=${param.join(',')}`];
    }
    return [];
  }
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
const useUrl = (options: IUrlOptions | any, baseUrl?: string): IBuilderResult => {
  const builderResult = new BuilderResult(
    options.path,
    options.pathVariables,
    options.queryParams,
    options.hash,
    options.disableCSV,
  );

  const { queryParams, pathVariables, path, hash, disableCSV } = builderResult;
  const builder = new UrlBuilder(baseUrl);

  const computedUrl = computed(() => {
    let tempUrl = `${builder.baseUrl}${path.value}`;
    tempUrl = tempUrl.replace(/([^:]\/)\/+/g, '$1');
    tempUrl = builder.buildPathVariables(tempUrl, pathVariables);
    tempUrl = builder.buildQueryParams(tempUrl, queryParams, disableCSV.value);
    tempUrl = builder.buildHash(tempUrl, hash.value);

    return tempUrl;
  });

  builderResult.setUrl(computedUrl);
  return builderResult;
};

/**
 * Create a new instance of useUrl()
 * @returns {function} Instance function
 */

const createUseUrlInstance = () => {
  return useUrl;
};

export { useUrl, createUseUrlInstance };
