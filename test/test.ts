import { useUrl } from '../src/index'

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
    hash: 'hashtag',
    disableCSV: false
}, 
'http://api.com')

console.log(url.value)

hash.value = "newHashTag"

console.log(url.value)

