import { AppRegistry } from 'react-native';
import EnvConfig from 'react-native-config';
import * as Sentry from "@sentry/react-native";

// import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';

import './src/Functions/OpenAppTimes';

Sentry.init({
    dsn: EnvConfig.SENTRY_DSN,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    _experiments: {
        // profilesSampleRate is relative to tracesSampleRate.
        // Here, we'll capture profiles for 100% of transactions.
        profilesSampleRate: 1.0,
    },
});

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
