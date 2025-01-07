import AsyncStorage from '@react-native-async-storage/async-storage';

async function getCurrentTeam(): Promise<ITeam> {
	const selectedTeamAsString = await AsyncStorage.getItem('currentTeam');

	if (selectedTeamAsString) {
		return JSON.parse(selectedTeamAsString);
	}

	throw new Error('Team is not selected');
}

async function setCurrentTeam(currentTeam: ITeam): Promise<void> {
	await AsyncStorage.setItem('currentTeam', JSON.stringify(currentTeam));
}

async function clearCurrentTeam(): Promise<void> {
	await AsyncStorage.removeItem('currentTeam');
}

export { getCurrentTeam, setCurrentTeam, clearCurrentTeam };
