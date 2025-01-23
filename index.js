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

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
