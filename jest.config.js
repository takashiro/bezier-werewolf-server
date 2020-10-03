module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'build/coverage',
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.ts',
	],
	globals: {
		'ts-jest': {
			tsConfig: 'test/tsconfig.json',
		},
	},
};
