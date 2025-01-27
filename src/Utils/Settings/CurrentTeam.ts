import AsyncStorage from '@react-native-async-storage/async-storage';

import { IOrganizedInfoResponse } from '@teams/Utils/User/Login/organizedInfo';

async function getCurrentTeam(): Promise<ITeam> {
	const data = await AsyncStorage.getItem('userInfo');
	const teamResponse = JSON.parse(String(data)) as IOrganizedInfoResponse;

	if (!teamResponse || !teamResponse.role) {
		throw new Error('Team is not selected');
	}

	return teamResponse.role.team;
}

export { getCurrentTeam };
