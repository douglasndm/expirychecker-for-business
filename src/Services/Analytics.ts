import { firebase } from '@react-native-firebase/analytics';

const enableFirebaseAnalytics = async (enable: boolean): Promise<void> => {
	await firebase.analytics().setAnalyticsCollectionEnabled(enable);
};

if (!__DEV__) {
	enableFirebaseAnalytics(true);
}
