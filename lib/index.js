import { ref, reactive, computed, isReactive } from 'vue-demi';
export class BuilderResult {
    constructor(path, pathVariables, queryParams, hash, disableCSV) {
        this.path = isReactive(path) ? path : ref(path.toString());
        this.hash = isReactive(hash) ? hash : ref(hash.toString());
        this.queryParams = isReactive(queryParams) ? queryParams : reactive(queryParams);
        this.pathVariables = isReactive(pathVariables) ? pathVariables : reactive(pathVariables);
        this.disableCSV = isReactive(disableCSV) ? disableCSV : ref(disableCSV);
        this.url = computed(() => '');
    }
    setUrl(url) {
        this.url = url;
    }
}
export class UrlBuilder {
    constructor(baseUrl) {
        this.baseUrl = baseUrl ?? '';
    }
    buildHash(url, hash) {
        if (url.match(/#.+/gi))
            return url.replace(/#.+/gi, `#${hash}`);
        return `${url}#${hash}`;
    }
    buildPathVariables(url, pathVariables) {
        Object.keys(pathVariables).forEach((_, index) => {
            const value = Object.values(pathVariables)[index];
            url = url.replace(/:([^\/]+)/gi, isReactive(value) ? value.value : value.toString());
        });
        return url;
    }
    buildQueryParams(url, queryParams, disableCSV = false) {
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
    buildCSV(key, param, disableCSV) {
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
const useUrl = (options, baseUrl) => {
    const builderResult = new BuilderResult(options.path, options.pathVariables, options.queryParams, options.hash, options.disableCSV);
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
