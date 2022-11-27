module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'build/coverage',
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/cli.ts',
	],
	globals: {
		'ts-jest': {
			tsconfig: 'test/tsconfig.json',
		},
	},
};
