"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUseUrlInstance = exports.useUrl = exports.UrlBuilder = exports.BuilderResult = void 0;
const vue_demi_1 = require("vue-demi");
(0, vue_demi_1.install)();
class BuilderResult {
    constructor(path, pathVariables, queryParams, hash, disableCSV) {
        this.path = (0, vue_demi_1.ref)(path.toString());
        this.hash = (0, vue_demi_1.ref)(hash.toString());
        this.queryParams = (0, vue_demi_1.reactive)(queryParams);
        this.pathVariables = (0, vue_demi_1.reactive)(pathVariables);
        this.disableCSV = (0, vue_demi_1.ref)(disableCSV);
        this.url = (0, vue_demi_1.computed)(() => '');
    }
    setUrl(url) {
        this.url = url;
    }
    ;
}
exports.BuilderResult = BuilderResult;
class UrlBuilder {
    constructor(baseUrl) {
        this.baseUrl = baseUrl ?? '';
    }
    buildHash(url, hash) {
        if (url.match(/#.+/ig))
            return url.replace(/#.+/ig, `#${hash}`);
        return `${url}#${hash}`;
    }
    buildPathVariables(url, pathVariables) {
        for (var key in Object.keys(pathVariables)) {
            url = url.replace(/:([^\/]+)/ig, key);
        }
        return url;
    }
    buildQueryParams(url, queryParams, disableCSV = false) {
        url = url.replace(/(\?|\&)([^=]+)\=([^&]+)/ig, '');
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
            .filter(x => x !== null);
        const paramsString = params.length > 0 ? `?${params.join('&')}` : '';
        return url + paramsString;
    }
    buildCSV(key, param, disableCSV) {
        if (Array.isArray(param)) {
            if (disableCSV) {
                return param
                    .map(p => `${key}=${p}`);
            }
            return [`${key}=${param.join(',')}`];
        }
        return [];
    }
}
exports.UrlBuilder = UrlBuilder;
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
    const computedUrl = (0, vue_demi_1.computed)(() => {
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
exports.useUrl = useUrl;
/**
 * Create a new instance of useUrl()
 * @param {string} baseUrl Base URL
 * @returns {function} Instance function
 */
const createUseUrlInstance = (baseUrl = '') => {
    return useUrl(baseUrl);
};
exports.createUseUrlInstance = createUseUrlInstance;
