import { AppRegistry } from 'react-native';
import * as Sentry from "@sentry/react-native";

// import '@services/PushNotificationHandler';

import '@services/Sentry';

import { name as appName } from './app.json';
import App from './src';

import './src/Functions/OpenAppTimes';

if (__DEV__) {
    require("./src/Services/Reactotron");
}

const sentryProfiler = Sentry.withProfiler(App);
AppRegistry.registerComponent(appName, () => Sentry.wrap(sentryProfiler));
