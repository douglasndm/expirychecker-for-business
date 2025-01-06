import AsyncStorage from '@react-native-async-storage/async-storage';

interface Role extends IRole {
	team: ITeam;
}

interface getSelectedTeamResponse {
	userRole: Role;
	teamPreferences: ITeamPreferences;
}

export async function getSelectedTeam(): Promise<getSelectedTeamResponse | null> {
	const selectedTeamAsString = await AsyncStorage.getItem('selectedTeam');
	const selectedTeamPreferencesAsString = await AsyncStorage.getItem(
		'selectedTeamPreferences'
	);

	if (!selectedTeamAsString || !selectedTeamPreferencesAsString) {
		return null;
	}
	const selectedTeam: getSelectedTeamResponse = {
		userRole: JSON.parse(selectedTeamAsString),
		teamPreferences: JSON.parse(selectedTeamPreferencesAsString),
	};

	return selectedTeam;
}

export async function setSelectedTeam(
	selectedTeam: getSelectedTeamResponse
): Promise<void> {
	await AsyncStorage.setItem(
		'selectedTeam',
		JSON.stringify(selectedTeam.userRole)
	);
	await AsyncStorage.setItem(
		'selectedTeamPreferences',
		JSON.stringify(selectedTeam.teamPreferences)
	);
}

export async function clearSelectedteam(): Promise<void> {
	await AsyncStorage.removeItem('selectedTeam');
	await AsyncStorage.removeItem('selectedTeamPreferences');
}
