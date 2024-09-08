const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const path = require('path');

const {
    withSentryConfig
} = require("@sentry/react-native/metro");

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

module.exports = withSentryConfig(mergeConfig(getDefaultConfig(__dirname), config));