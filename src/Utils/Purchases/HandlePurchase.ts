import Purchases from '@services/RevenueCat';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { getCurrentTeam } from '../Settings/CurrentTeam';
import { clearSubscription } from '../Subscriptions/ClearCache';
import { getCurrentSubscription } from '../Subscriptions/GetCurrent';

async function handlePurchase(): Promise<boolean> {
	const currentTeam = await getCurrentTeam();
	if (!currentTeam) return false;

	await Purchases.logIn(currentTeam.id);

	if (!__DEV__) {
		Analytics().logEvent('started_susbscription_process');
	}

	const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({});

	if (
		paywallResult === PAYWALL_RESULT.PURCHASED ||
		paywallResult === PAYWALL_RESULT.RESTORED
	) {
		if (paywallResult === PAYWALL_RESULT.PURCHASED) {
			showMessage({
				message: strings.Util_HandlePurchase_Alert_Subscription_Success,
				type: 'info',
			});

			await clearSubscription();

			// This is to force server to update the subscription
			await getCurrentSubscription({});

			if (!__DEV__) {
				Analytics().logEvent('user_subscribed_successfully');
			}
		} else if (paywallResult === PAYWALL_RESULT.RESTORED) {
			showMessage({
				message: strings.Util_HandlePurchase_Alert_Restore_Success,
				type: 'info',
			});
		}

		return true;
	}

	if (paywallResult === PAYWALL_RESULT.CANCELLED) {
		if (!__DEV__) {
			Analytics().logEvent('user_cancel_subscribe_process');
		}
	}

	return false;
}

export { handlePurchase };
