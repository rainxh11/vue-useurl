import { ref, reactive, computed } from 'vue-demi';
import { Ref, UnwrapRef, ComputedRef } from "@vue/composition-api"

export type IQueryParams = Record<
  string,
  null | undefined | string | number | string[] | (string | number)[] | Ref<any> | UnwrapRef<any>
>;

export type IPathVariables = Record<string, string | number | Ref<any>>

interface IUrlOptions {
    path?: string | number;
    queryParams?: IQueryParams;
    disableCSV?: boolean;
    hash?: string | number;
    pathVariables?: IPathVariables;
}

interface IBuilderResult {
    path: Ref<string>;
    hash: Ref<string | number>;
    queryParams: UnwrapRef<IQueryParams>;
    pathVariables: UnwrapRef<IPathVariables>;
    url: ComputedRef<string>;
    disableCSV: Ref<boolean>;
    setUrl: (url:ComputedRef<string>) => void
}

class BuilderResult implements IBuilderResult {
    constructor(path:string|number, pathVariables:IPathVariables, queryParams:IQueryParams, hash:string|number, disableCSV:boolean) {
        this.path =  ref(path.toString())
        this.hash = ref(hash.toString())
        this.queryParams = reactive(queryParams)
        this.pathVariables = reactive(pathVariables)
        this.disableCSV = ref(disableCSV)
        this.url = computed(() => '')
    }
    setUrl(url: ComputedRef<string>): void {
        this.url = url
    };
    path: Ref<string>;
    hash: Ref<string | number>;
    queryParams: UnwrapRef<IQueryParams>;
    pathVariables: UnwrapRef<IPathVariables>;
    url: ComputedRef<string>;
    disableCSV: Ref<boolean>;
}

export class UrlBuilder {
    baseUrl: string;

    constructor(baseUrl?:string | null | undefined) {
        this.baseUrl = baseUrl ?? ''
    }
    public buildHash(url:string, hash:string | number):string {
        if(url.match(/#.+/ig)) return url.replace(/#.+/ig, `#${hash}`)
        return `${url}#${hash}`
    }
    public buildPathVariables(url:string, pathVariables:IPathVariables): string {
        for(var key in Object.keys(pathVariables)) {
            url = url.replace(/:([^\/]+)/ig, key)  
        }
        return url
    }
    public buildQueryParams(url:string, queryParams:IQueryParams, disableCSV = false): string {
        url =  url.replace(/(\?|\&)([^=]+)\=([^&]+)/ig, '')
        const params = Object.keys(queryParams)
            .map((key,index) => {
                const param = Object.values(queryParams)[index]                
                switch(typeof key) {
                    default:
                        return `${key}=${param}`
                    case 'object':
                        return this.buildCSV(key, param, disableCSV)
                }
            })
            .flat()
            .filter(x => x !== null)
        const paramsString = params.length > 0 ? `?${params.join('&')}` : ''
        return url + paramsString
    }
    public buildCSV(key:string, param:any, disableCSV:boolean): string[] | any[] {
        if(Array.isArray(param)) {
            if(disableCSV) {
                return param
                    .map(p => `${key}=${p}`)
            } 
            return [`${key}=${param.join(',')}`]
        }
        return []
    }
} 

const useUrl = (options:IUrlOptions|any, baseUrl?:string):IBuilderResult => {
    const builderResult = new BuilderResult(
        options.path, 
        options.pathVariables, 
        options.queryParams, 
        options.hash,
        options.disableCSV)

    const {  queryParams, pathVariables, path, hash, disableCSV } =  builderResult
    const builder = new UrlBuilder(baseUrl)
    
    const computedUrl = computed(() => {
        let tempUrl  = (builder.baseUrl  + path.value).replace('//','/')
        tempUrl = builder.buildPathVariables(tempUrl, pathVariables)
        tempUrl = builder.buildQueryParams(tempUrl, queryParams, disableCSV.value)
        tempUrl = builder.buildHash(tempUrl, hash.value)

        return tempUrl
    })
        
    builderResult.setUrl(computedUrl)
    return builderResult
}

export { useUrl }