# vue-useurl ( A Url Builder Vue Hook )
[![NPM version](https://img.shields.io/npm/v/vue-useurl.svg)](https://www.npmjs.com/package/vue-useurl)

A library for building URL using ***(Query Parameters, Path Variables, Hash)*,** while being reactive and ready to use as Vue Composition API Hook

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
buildUrl('http://example.com', {
  path: 'about',
  hash: 'hash',
  queryParams: {
    foo: 'bar',
    bar: 'baz'
  }
});

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

  const { isFetching, error, data } = useFetch<Contact[]>(
    url,
    { initialData: { results: [] }, refetch: true}
  )
    .get()
    .json()
```

## License

This is licensed under an MIT License. (LICENSE)