import { computed, ComputedRef, isReactive, reactive, ref, Ref, UnwrapRef } from 'vue-demi'

export type MaybeRef<T> = T | Ref<T>
export type MaybeReactive<T> = T | UnwrapRef<T>

export type IQueryParams = Record<
	string,
	null | undefined | string | number | string[] | (string | number)[] | Ref<any> | UnwrapRef<any>
>

export type IPathVariables = Record<string, string | number | Ref<any>>

export interface IUrlOptions {
	path?: MaybeRef<string | number>
	pathVariables?: MaybeReactive<IPathVariables>
	queryParams?: MaybeReactive<IQueryParams>
	hash?: MaybeRef<string | number>
	arraySerializer?: (array: unknown[]) => string
}

export interface IBuilderResult {
	path: Ref<string>
	pathVariables: UnwrapRef<IPathVariables>
	queryParams: UnwrapRef<IQueryParams>
	hash: Ref<string | number>
	arraySerializer: (array: unknown[]) => string
	url: ComputedRef<string>
	setUrl: (url: ComputedRef<string>) => void
}

export class BuilderResult implements IBuilderResult {
	path: Ref<string>
	pathVariables: UnwrapRef<IPathVariables>
	queryParams: UnwrapRef<IQueryParams>
	hash: Ref<string>
	arraySerializer: (array: unknown[]) => string
	url: ComputedRef<string>

	constructor(
		path: MaybeRef<string>,
		pathVariables: MaybeReactive<IPathVariables>,
		queryParams: MaybeReactive<IQueryParams>,
		hash: MaybeRef<string>,
		arraySerializer: (array: unknown[]) => string,
	) {
		this.path = ref(path)
		this.pathVariables = reactive(pathVariables)
		this.queryParams = reactive(queryParams)
		this.hash = ref(hash)
		this.arraySerializer = arraySerializer
		this.url = computed(() => '')
	}

	setUrl(url: ComputedRef<string>): void {
		this.url = url
	}
}

export class UrlBuilder {
	baseUrl: string
	private defaultSerializer: (array: any[]) => string

	constructor(baseUrl?: string | null | undefined) {
		this.baseUrl = baseUrl ?? ''
		this.defaultSerializer = v => v.join(',')
	}

	public buildHash(url: string, hash: string | number): string {
		hash = hash ? `#${hash}` : ''
		if (url.match(/#.+/gi)) return url.replace(/#.+/gi, `${hash}`)
		return `${url}${hash}`
	}

	public buildPathVariables(url: string, pathVariables: IPathVariables): string {
		Object.keys(pathVariables).forEach((_, index) => {
			const value = Object.values(pathVariables)[index]
			url = url.replace(/:([^\/]+)/gi, isReactive(value) ? (value as Ref).value : value?.toString())
		})
		return url
	}

	public buildQueryParams(
		url: string,
		queryParams: IQueryParams,
		arraySerializer?: (array: unknown[]) => string,
	): string {
		const serializer = arraySerializer ?? this.defaultSerializer
		Object.entries(queryParams)
			.filter(([, value]) => value instanceof Array)
			.forEach(([key, value]) => {
				queryParams[key] = serializer(value)
			})
		const urlObject = new URL(url)
		var searchParams = new URLSearchParams(queryParams)
		searchParams.forEach((value, key) => urlObject.searchParams.set(key, value))
		return urlObject.toString()
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
		options?.path ?? '',
		options?.pathVariables ?? {},
		options?.queryParams ?? {},
		options?.hash ?? '',
		options?.arraySerializer,
	)

	const { queryParams, pathVariables, path, hash, arraySerializer } = builderResult
	const builder = new UrlBuilder(baseUrl)

	const computedUrl = computed(() => {
		let tempUrl = `${builder.baseUrl}${path.value}`
		tempUrl = tempUrl.replace(/([^:]\/)\/+/g, '$1')
		tempUrl = builder.buildPathVariables(tempUrl, pathVariables)
		tempUrl = builder.buildQueryParams(tempUrl, queryParams, arraySerializer)
		tempUrl = builder.buildHash(tempUrl, hash.value)
		return new URL(tempUrl).toString()
	})

	builderResult.setUrl(computedUrl)
	return builderResult
}

/**
 * Create a new instance of useUrl()
 * @returns {function} Instance function
 */

const createUseUrlInstance = () => useUrl

export { useUrl, createUseUrlInstance }
