import AsyncStorage from '@react-native-async-storage/async-storage';

async function getCurrentSubscription(): Promise<ITeamSubscription | null> {
	const selectedTeamAsString = await AsyncStorage.getItem(
		'currentTeamSubscription'
	);

	if (selectedTeamAsString) {
		return JSON.parse(selectedTeamAsString);
	}

	return null;
}

async function setCurrentTeamSubscription(
	currentTeamSubscription: ITeamSubscription
): Promise<void> {
	await AsyncStorage.setItem(
		'currentTeamSubscription',
		JSON.stringify(currentTeamSubscription)
	);
}

async function clearCurrentTeamSubscription(): Promise<void> {
	await AsyncStorage.removeItem('currentTeamSubscription');
}

export {
	getCurrentSubscription,
	setCurrentTeamSubscription,
	clearCurrentTeamSubscription,
};
