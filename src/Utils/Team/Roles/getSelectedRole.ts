import AsyncStorage from '@react-native-async-storage/async-storage';

import { IOrganizedInfoResponse } from '@teams/Utils/User/Login/organizedInfo';

async function getSelectedRole(): Promise<IUserRoles | null> {
	const setting = await AsyncStorage.getItem('userInfo');
	const response = JSON.parse(String(setting)) as IOrganizedInfoResponse;

	if (response.role) {
		return {
			role: response.role.name,
			status: response.role.status,
			store: response.role.store,
			team: response.role.team,
		};
	}

	return null;
}

export { getSelectedRole };
