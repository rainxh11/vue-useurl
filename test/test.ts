import { useDebounce } from '@vueuse/core';
import { useUrl, createUseUrlInstance } from '../src/index'
import { ref, reactive } from 'vue-demi'
 
const search = ref('query')
const filters = ref([ 'filter1', 'filter2', 'filter3' ])

const urlBuilder = createUseUrlInstance()

const { url, queryParams, pathVariables, hash, path, disableCSV } = urlBuilder({ 
    path: '/api/v1/entity/:id/subentity',
    pathVariables: {
      id: 1001
    },
    queryParams: {
      search: useDebounce(search, 3500),
      sort: 'propery',
      limit: 100,
      page: 1,
      filters: useDebounce(filters, 3500)
    },
    hash: 'someHash'
}, 
'https://somedomain.com/')

console.log(url.value)

search.value = "newQuery"
filters.value = ["newFilter1" , "newFilter"]

setTimeout(() => {
  console.log(url.value)
},5000)


