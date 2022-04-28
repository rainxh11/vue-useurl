import { ref, reactive, computed } from 'vue-demi';
class BuilderResult {
    constructor(path, pathVariables, queryParams, hash, disableCSV) {
        this.path = ref(path.toString());
        this.hash = ref(hash.toString());
        this.queryParams = reactive(queryParams);
        this.pathVariables = reactive(pathVariables);
        this.disableCSV = ref(disableCSV);
        this.url = computed(() => '');
    }
    setUrl(url) {
        this.url = url;
    }
    ;
}
export class UrlBuilder {
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
            switch (typeof key) {
                default:
                    return `${key}=${Object.values(queryParams)[index]}`;
                case 'object':
                    const param = Object.values(queryParams)[index];
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
const useUrl = (options, baseUrl) => {
    const builderResult = new BuilderResult(options.path, options.pathVariables, options.queryParams, options.hash, options.disableCSV);
    const { queryParams, pathVariables, path, hash, disableCSV } = builderResult;
    const builder = new UrlBuilder(baseUrl);
    const computedUrl = computed(() => {
        let tempUrl = (builder.baseUrl + path.value).replace('//', '/');
        tempUrl = builder.buildPathVariables(tempUrl, pathVariables);
        tempUrl = builder.buildQueryParams(tempUrl, queryParams, disableCSV.value);
        tempUrl = builder.buildHash(tempUrl, hash.value);
        return tempUrl;
    });
    builderResult.setUrl(computedUrl);
    return builderResult;
};
export { useUrl };
