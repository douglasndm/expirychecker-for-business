import messaging from '@react-native-firebase/messaging';

async function requestUserPermission(): Promise<void> {
	await messaging().requestPermission({
		alert: true,
		badge: true,
		announcement: true,
		sound: true,
	});
}

requestUserPermission();
