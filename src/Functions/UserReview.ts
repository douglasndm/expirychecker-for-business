import InAppReview from 'react-native-in-app-review';

export function askUserForAReview(): void {
	// This package is only available on android version >= 21 and iOS >= 10.3

	// Give you result if version of device supported to rate app or not!
	if (InAppReview.isAvailable()) {
		// trigger UI InAppreview
		InAppReview.RequestInAppReview();
	}
}
