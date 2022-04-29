"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const core_1 = require("@vueuse/core");
const { url, queryParams, pathVariables, hash, path, disableCSV } = (0, index_1.useUrl)({
    path: '/api/v1/entity/:id/subentity',
    pathVariables: {
        id: 1001
    },
    queryParams: {
        search: 'query',
        sort: 'propery',
        limit: 100,
        page: 1,
        filters: ['filter1', 'filter2', 'filter3']
    },
    hash: 'someHash'
}, 'https://somedomain.com');
queryParams.size = (0, core_1.useDebounce)(queryParams.size, 500);
console.log(url.value);
hash.value = "newHashTag";
queryParams.size = 2;
console.log(url.value);
