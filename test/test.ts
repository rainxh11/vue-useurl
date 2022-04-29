import { useUrl } from '../src/index'
import { useDebounce } from '@vueuse/core'
 
const { url, queryParams, pathVariables, hash, path, disableCSV } = useUrl({ 
    path: '/api/v1/entity/:id/subentity',
    pathVariables: {
      id: 1001
    },
    queryParams: {
      search: 'query',
      sort: 'propery',
      limit: 100,
      page: 1,
      filters: [ 'filter1', 'filter2', 'filter3' ]
    },
    hash: 'someHash'
}, 
'https://somedomain.com')

queryParams.size = useDebounce<number>(queryParams.size, 500)


console.log(url.value)

hash.value = "newHashTag"
queryParams.size = 2

console.log(url.value)

