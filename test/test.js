"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@vueuse/core");
const index_1 = require("../src/index");
const vue_demi_1 = require("vue-demi");
const search = (0, vue_demi_1.ref)('query');
const filters = (0, vue_demi_1.ref)(['filter1', 'filter2', 'filter3']);
const { url, queryParams, pathVariables, hash, path, disableCSV } = (0, index_1.useUrl)({
    path: '/api/v1/entity/:id/subentity',
    pathVariables: {
        id: 1001
    },
    queryParams: {
        search: (0, core_1.useDebounce)(search, 3500),
        sort: 'propery',
        limit: 100,
        page: 1,
        filters: (0, core_1.useDebounce)(filters, 3500)
    },
    hash: 'someHash'
}, 'https://somedomain.com/');
console.log(url.value);
search.value = "newQuery";
filters.value = ["newFilter1", "newFilter"];
setTimeout(() => {
    console.log(url.value);
}, 5000);
