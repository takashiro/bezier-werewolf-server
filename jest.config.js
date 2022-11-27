/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'build/coverage',
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/cli.ts',
	],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: './test/tsconfig.json',
			},
		],
	},
};
