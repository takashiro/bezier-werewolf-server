/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
export default {
	testEnvironment: 'node',
	coverageDirectory: 'build/coverage',
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/cli.ts',
	],
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: './test/tsconfig.json',
				useESM: true,
			},
		],
	},
};
