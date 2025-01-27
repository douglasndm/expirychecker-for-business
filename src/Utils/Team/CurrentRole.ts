import AsyncStorage from '@react-native-async-storage/async-storage';

import { IOrganizedInfoResponse } from '@teams/Utils/User/Login/organizedInfo';

async function setCurrentRole(role: IRole): Promise<void> {
	const setting = await AsyncStorage.getItem('userInfo');
	const response = JSON.parse(String(setting)) as IOrganizedInfoResponse;

	const updatedInfo: IOrganizedInfoResponse = {
		...response,
		role: {
			...response.role,
			name: role.name,
			status: role.status,
			code: role.code,
			team: response.role?.team as ITeam,
			store: response.role?.store ? response.role.store : null,
		},
	};

	await AsyncStorage.setItem('userInfo', JSON.stringify(updatedInfo));
}

export { setCurrentRole };
