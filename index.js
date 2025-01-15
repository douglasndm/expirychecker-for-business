import { AppRegistry } from 'react-native';
import EnvConfig from 'react-native-config';
import * as Sentry from "@sentry/react-native";

// import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';

import './src/Functions/OpenAppTimes';

const reactNavigationIntegration =  Sentry.reactNavigationIntegration();

Sentry.init({
    dsn: EnvConfig.SENTRY_DSN,
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    enableSpotlight: __DEV__,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    enabled: !__DEV__,
    enableCaptureFailedRequests: !__DEV__,
    tracesSampleRate: 1.0,
    enableAppStartTracking: true,
    enableNativeFramesTracking: true,
    enableStallTracking: true,
    enableUserInteractionTracing: true,
    integrations: [
        reactNavigationIntegration
    ],
});


AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
