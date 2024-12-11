import AsyncStorage from '@react-native-async-storage/async-storage';

interface ISetSettingProps {
	type:
		| 'HowManyDaysToBeNextExp'
		| 'AutoComplete'
		| 'EnableNotifications'
		| 'NotificationCadency'
		| 'HowManyTimesAppWasOpen';
	value: string;
}

export async function setSetting({
	type,
	value,
}: ISetSettingProps): Promise<void> {
	await AsyncStorage.setItem(type, value);
}

export async function setAutoComplete(value: boolean): Promise<void> {
	await setSetting({
		type: 'AutoComplete',
		value: String(value),
	});
}

export async function setEnableNotifications(enable: boolean): Promise<void> {
	await setSetting({
		type: 'EnableNotifications',
		value: String(enable),
	});
}

async function getSetting({
	type,
}: Omit<ISetSettingProps, 'value'>): Promise<string | undefined> {
	const setting = await AsyncStorage.getItem(type);

	if (!setting) {
		return undefined;
	}

	return setting;
}

export async function getAutoComplete(): Promise<boolean> {
	const setting = await getSetting({ type: 'AutoComplete' });

	if (setting === 'true') {
		return true;
	}
	return false;
}

export async function getEnableNotifications(): Promise<boolean> {
	const setting = await getSetting({ type: 'EnableNotifications' });

	if (setting === 'false') return false;
	return true;
}

export async function getHowManyTimesAppWasOpen(): Promise<number | null> {
	const setting = await getSetting({ type: 'HowManyTimesAppWasOpen' });

	if (setting) {
		return Number(setting);
	}

	return null;
}
