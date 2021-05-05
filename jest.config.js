module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'build/coverage',
	collectCoverage: true,
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
