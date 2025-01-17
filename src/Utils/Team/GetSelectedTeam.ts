import AsyncStorage from '@react-native-async-storage/async-storage';

import { IOrganizedInfoResponse } from '@teams/Utils/User/Login/organizedInfo';

async function getSelectedTeam(): Promise<ITeam | null> {
	const setting = await AsyncStorage.getItem('userInfo');
	const response = JSON.parse(String(setting)) as IOrganizedInfoResponse;

	if (response.role?.team) {
		return response.role.team;
	}

	return null;
}

export { getSelectedTeam };
