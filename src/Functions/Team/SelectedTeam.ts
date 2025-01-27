import AsyncStorage from '@react-native-async-storage/async-storage';

import { IOrganizedInfoResponse } from '@teams/Utils/User/Login/organizedInfo';

interface Role extends IRole {
	team: ITeam;
}

interface getSelectedTeamResponse {
	userRole: Role;
	teamPreferences: ITeamPreferences;
}

export async function getSelectedTeam(): Promise<getSelectedTeamResponse | null> {
	const data = await AsyncStorage.getItem('userInfo');
	const teamResponse = JSON.parse(String(data)) as IOrganizedInfoResponse;

	const selectedTeamPreferencesAsString = await AsyncStorage.getItem(
		'selectedTeamPreferences'
	);

	if (
		!teamResponse ||
		!teamResponse.role ||
		!selectedTeamPreferencesAsString
	) {
		return null;
	}
	const selectedTeam: getSelectedTeamResponse = {
		userRole: {
			code: teamResponse.role.code,
			name: teamResponse.role.name,
			status: teamResponse.role.status,
			team: teamResponse.role.team,
		},
		teamPreferences: JSON.parse(selectedTeamPreferencesAsString),
	};

	return selectedTeam;
}

export async function clearSelectedteam(): Promise<void> {
	const data = await AsyncStorage.getItem('userInfo');
	const userInfo = JSON.parse(String(data)) as IOrganizedInfoResponse;

	const updatedInfo: IOrganizedInfoResponse = {
		...userInfo,
		role: undefined,
		teamSubscription: null,
	};

	await AsyncStorage.setItem('userInfo', JSON.stringify(updatedInfo));

	await AsyncStorage.removeItem('selectedTeam');
	await AsyncStorage.removeItem('selectedTeamPreferences');
}
