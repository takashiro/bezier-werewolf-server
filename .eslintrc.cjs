module.exports = {
	env: {
		browser: true,
		es2020: true,
		node: true,
	},
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
	],
	rules: {
		'consistent-return': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		indent: [
			'error',
			'tab',
		],
		'linebreak-style': 'off',
		'max-len': 'off',
		'no-await-in-loop': 'off',
		'no-bitwise': 'off',
		'no-continue': 'off',
		'no-plusplus': 'off',
		'no-param-reassign': 'off',
		'no-shadow': 'off',
		'no-tabs': 'off',
		'no-restricted-syntax': [
			'error',
			'WithStatement',
		],
		'no-use-before-define': 'off',
		'@typescript-eslint/no-shadow': [
			'error',
		],
		'@typescript-eslint/no-unsafe-declaration-merging': 'off',
		'@typescript-eslint/no-use-before-define': [
			'error',
		],
	},
};
