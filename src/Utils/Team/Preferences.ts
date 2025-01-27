import AsyncStorage from '@react-native-async-storage/async-storage';

async function setTeamPreferences(prefes: ITeamPreferences): Promise<void> {
	await AsyncStorage.setItem(
		'selectedTeamPreferences',
		JSON.stringify(prefes)
	);
}

export { setTeamPreferences };
