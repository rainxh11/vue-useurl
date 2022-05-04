<img src="https://raw.githubusercontent.com/rainxh11/vue-useurl/master/assets/logo.svg" width="300">

# 🔗 Vue-useUrl 
## Reactive Url Builder Vue Composable for Vue 2 & Vue 3 
[![NPM version](https://img.shields.io/npm/v/vue-useurl.svg)](https://www.npmjs.com/package/vue-useurl)

A library for building URL using ***(Query Parameters, Path Variables, Hash, Path)*** while being reactive and ready to use as Vue Composition API Composable

## Installation

To install with npm:

```
npm install vue-useurl --save
```

## Usage

```ts
import { useUrl } from 'vue-useurl'

const params = {
  search: 'ahmed',
  limit: 50,
  page: 12,
  sort: 'CreatedOn',
  types: ['Cancelled', 'OnGoing']
}

const { url, queryParams, pathVariables, hash, path, disableCSV } = useUrl({ 
  path: '/api/v1/users/:id/search',
  pathVariables: {
    id: 451
  },
  queryParams: {
    ...params
  },
  hash: 'someHash',
  disableCSV: false
}, 
'http://api.com')
```

## Options

The `userUrl` function accepts two arguments. The first is 'options' of type IUrlOptions e.g:
```ts

{
  path: '/path/path1', // URL Path
  pathVariables: { 
    id: 451
  }, // Path variables e.g: /:id/
  queryParams: {
    limit:10,
    sortBy: 'property',
    page: 1
  }, // Query parameters
  hash: 'someHash', // Hash
  disableCSV: false 
	// Enabled: param=1&param=2&param=3
	// Disabled: param=1,2,3
}
```

The second is 'baseUrl' that will be appended to Url path

```ts
useUrl({ 
    path: '/about',
    queryParams: {
      foo:'bar',
      fizz: 'baz'
    },
    hash: 'contact',
    disableCSV: false
  }, 
  'http://api.com')

// returns http://api.com/about?foo=bar&bar=baz#contact
```

Variables returned by `useUrl()` are all reactive objects, changing any of: `path` `queryParams` `pathVariables` `hash` `disableCSV` will rebuild `url`

```ts
const { url, queryParams, pathVariables, hash, path, disableCSV } = useUrl(/*..*/)
```

## Usage with VueUse 'useFetch()'

This library is compatible with VueUse `useFetch()`, and `url` returned from `useUrl()` can easily be used to trigger auto-reftech if option `{ refetch: true }` is passed to `useFetch()` which make for intuitive and easy way to work with url parametes and variables without the need to modify url string directly
```ts
import { useFetch } from "@vueuse/core"
import { useUrl } from 'vue-useurl'

  const { url, queryParams, pathVariables, hash, path, disableCSV } = useUrl({ 
    path: '/api/v1/users/:id/search',
    pathVariables: {
      id: 451
    },
    queryParams: {
      search: 'ahmed',
      limit: 50,
      page: 12,
      sort: 'CreatedOn',
      types: ['Cancelled', 'OnGoing']
    },
    hash: 'hashtag',
    disableCSV: false
  }, 
  'http://api.com')

  const { isFetching, error, data } = useFetch(
    url,
    { initialData: { results: [] }, refetch: true})
  .get()
  .json()
```

## How to use debouncing, throttling and other reactive backpressures with useUrl():

```ts
import { useFetch, useDebounce } from "@vueuse/core"
import { useUrl } from 'vue-useurl'
import { ref } from 'vue-demi'

export useApi() {
  const search = ref('query') //
  const filters = ref([ 'filter1', 'filter2', 'filter3' ]) // declare reactive varibales 

  const { url, queryParams, pathVariables, hash, path, disableCSV } = useUrl({ 
    path: '/api/v1/users/:id/search',
    pathVariables: {
      id: 451
    },
    queryParams: {
      search: useDebounce(search, 500), // 
      limit: 50,
      page: 12,
      sort: 'CreatedOn',
      types: useDebounce(filters, 3500) // then pass their reactive backpressure objects instead
    },
    hash: 'hashtag',
    disableCSV: false
  }, 
  'http://api.com')

  const { isFetching, error, data } = useFetch(
    url,
    { initialData: { results: [] }, refetch: true})
  .get()
  .json()

  return {
    data,
    search, //
    filters,// changing this now will trigger the url re-build
    queryParams,
    pathVariables,
    hash,
    path, 
    url
  }
}

```

## License

This is licensed under an MIT License.
