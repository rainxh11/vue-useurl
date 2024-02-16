import { createUseUrlInstance } from '../src/index'
import { ref } from 'vue-demi'

const urlBuilder = createUseUrlInstance()

test('Path variables test', () => {
	const { url } = urlBuilder(
		{
			path: '/api/v1/entity/:id',
			pathVariables: {
				id: ref(1),
			},
		},
		'https://somedomain.com/',
	)
	expect(url.value).toBe('https://somedomain.com/api/v1/entity/1')
})


test('Query params test', () => {
	const { url } = urlBuilder(
		{
			path: '/api/v1/entity/list',
			queryParams: {
				string: ref('query'),
				boolean: false,
				someUndefined: undefined,
				someNull: null,
			},
		},
		'https://somedomain.com/',
	)
	expect(url.value).toBe('https://somedomain.com/api/v1/entity/list?string=query&boolean=false&someUndefined=undefined&someNull=null')
})


test('Query params with Array Query test', () => {
	const { url } = urlBuilder(
		{
			path: '/api/v1/entity/list',
			queryParams: {
				string: ['query1', 'query2', 'query3'],
			},
		},
		'https://somedomain.com/',
	)
	expect(url.value).toBe('https://somedomain.com/api/v1/entity/list?string=query1%2Cquery2%2Cquery3')
})


test('Query params with Custom Array Serializer Query test', () => {
	const { url } = urlBuilder(
		{
			arraySerializer: (v: any[]) => JSON.stringify(v),
			path: '/api/v1/entity/list',
			queryParams: {
				string: ['query1', 'query2', 'query3'],
			},
		},
		'https://somedomain.com/',
	)
	expect(url.value).toBe('https://somedomain.com/api/v1/entity/list?string=%5B%22query1%22%2C%22query2%22%2C%22query3%22%5D')
})

test('Hash test', () => {
	const { url } = urlBuilder(
		{
			path: '/api/v1/entity/list',
			hash: 'hash',
		},
		'https://somedomain.com/',
	)
	expect(url.value).toBe('https://somedomain.com/api/v1/entity/list#hash')
})


test('All together test', () => {
	const { url } = urlBuilder(
		{
			path: '/api/v1/entity/:id',
			pathVariables: {
				id: ref(1),
			},
			queryParams: {
				string: ref('query'),
				boolean: false,
				someUndefined: undefined,
				someNull: null,
			},
			hash: 'hash',
		},
		'https://somedomain.com/',
	)
	expect(url.value)
		.toBe('https://somedomain.com/api/v1/entity/1?string=query&boolean=false&someUndefined=undefined&someNull=null#hash')
})


test('Reactivity test', () => {
	const id = ref(1)
	const queryParam = ref('query')
	const { url } = urlBuilder(
		{
			path: '/api/v1/entity/:id',
			pathVariables: {
				id: id,
			},
			queryParams: {
				string: queryParam,
				boolean: false,
				someUndefined: undefined,
				someNull: null,
			},
			hash: 'hash',
		},
		'https://somedomain.com/',
	)
	expect(url.value).toBe('https://somedomain.com/api/v1/entity/1?string=query&boolean=false&someUndefined=undefined&someNull=null#hash')
	id.value = 2
	queryParam.value = 'query2'
	expect(url.value).toBe('https://somedomain.com/api/v1/entity/2?string=query2&boolean=false&someUndefined=undefined&someNull=null#hash')
})
