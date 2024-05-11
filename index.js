import { AppRegistry } from 'react-native';

import '@services/Bugsnag';
import { requestNotificationPermission } from '@services/Notifications/Permission';
import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

if (__DEV__) {
	require('@services/Reactotron');
}

requestNotificationPermission();

AppRegistry.registerComponent(appName, () => App);
