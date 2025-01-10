module.exports = {
	presets: ['module:@react-native/babel-preset'],
	env: {
		production: {
			plugins: ['react-native-paper/babel'],
		},
	},
	plugins: [
		[
			require.resolve('babel-plugin-module-resolver'),
			{
				cwd: 'babelrc',
				extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
				alias: {
					'~': './src',
					'@assets': '../shared/src/Assets',
					'@components': '../shared/src/Components',
					'@views': '../shared/src/Views',
					'@shared': '../shared/src',
					'@themes': '../shared/src/Themes',
					'@services': '../shared/src/Services',
					'@styles': '../shared/src/Styles',
					'@utils': '../shared/src/Utils',
                    '@errors': '../shared/src/Errors',
					'@teams': '../teams/src',
				},
			},
		],
		'jest-hoist',
        'babel-plugin-styled-components',
		'react-native-reanimated/plugin',
	],
};
