module.exports = {
	root: true,

	env: {
		node: true,
	},

	extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],

	parserOptions: {
		parser: "babel-eslint",
	},

	rules: {
		"no-empty": "off",
		"prettier/prettier": 0,
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"vue/no-parsing-error": [
			2,
			{
				"invalid-first-character-of-tag-name": false,
			},
		],
	},

	overrides: [
		{
			files: [
				"**/__tests__/*.{j,t}s?(x)",
				"**/tests/unit/**/*.spec.{j,t}s?(x)",
			],
			env: {
				jest: true,
			},
		},
		{
			files: [
				"**/__tests__/*.{j,t}s?(x)",
				"**/tests/unit/**/*.spec.{j,t}s?(x)",
			],
			env: {
				jest: true,
			},
		},
	],
}
