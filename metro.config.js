const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withSentryConfig } = require('@sentry/react-native/metro');

const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
	watchFolders: [
		path.resolve(__dirname, '../../node_modules'),
		path.resolve(__dirname, '../../packages/shared'),
	],
};

const defaultConfig = mergeConfig(getDefaultConfig(__dirname), config);

module.exports = withSentryConfig(withSentryConfig(defaultConfig, {
    enableSourceContextInDevelopment: false,
}));
