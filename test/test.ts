import { useDebounce } from "@vueuse/core"
import { useUrl, createUseUrlInstance } from "../src/index"
import { ref, reactive, set } from "vue-demi"

const search = ref("query")
const filters = ref(["filter1", "filter2", "filter3"])

const params = reactive({
	search: "query",
	param: "something",
})

const urlBuilder = createUseUrlInstance()

const { url, queryParams, pathVariables, hash, path, disableCSV } = urlBuilder(
	{
		path: "/api/v1/entity/:id/subentity",
		pathVariables: {
			id: 1,
		},
		queryParams: params,
		hash: "someHash",
	},
	"https://somedomain.com/",
)

console.log(url.value)

set(params, "s", ref("extra"))
setInterval(() => {
	pathVariables.id = (pathVariables.id as number) + 1
	console.log(url.value)
}, 1000)

/*search.value = "newQuery"
filters.value = ["newFilter1" , "newFilter"]

setTimeout(() => {
  console.log(url.value)
},500)*/
