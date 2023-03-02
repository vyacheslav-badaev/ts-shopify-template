module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'airbnb/hooks',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:prettier/recommended',
		'plugin:import/recommended',
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2021,
		sourceType: 'module',
		tsconfigRootDir: '.',
		project: [
			'./tsconfig.json',
		],
	},
	'plugins': [
		'import',
		'node',
		'jsx-a11y',
		'react-hooks',
		'@typescript-eslint',
	],
	settings: {
		'import/resolver': {
			'node': {
				'extensions': ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/no-unsafe-assignment': 'error',
		'@typescript-eslint/no-unsafe-call': 'error',
		'@typescript-eslint/no-unsafe-member-access': 'error',
		'@typescript-eslint/no-unsafe-return': 'error',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'import/extensions': 'off',
		'import/prefer-default-export': 'off',
		'node/no-missing-import': 'off',
		'node/no-unsupported-features/es-syntax': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'import/no-extraneous-dependencies': ['warn', {
			'devDependencies': true,
			'optionalDependencies': true,
			'peerDependencies': true,
			'includeInternal': true,
			'includeTypes': true,
		}],
		'@typescript-eslint/no-misused-promises': [
			'error',
			{
				'checksVoidReturn': false,
			},
		],
		'@typescript-eslint/ban-ts-comment': 'off',
		'import/no-unresolved': 'off',
	},
	env: {
		es6: true,
		node: true,
		browser: true,
	},
};
