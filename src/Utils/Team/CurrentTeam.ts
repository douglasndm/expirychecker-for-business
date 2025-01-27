import AsyncStorage from '@react-native-async-storage/async-storage';

import { IOrganizedInfoResponse } from '@teams/Utils/User/Login/organizedInfo';

async function setCurrentTeam(team: ITeam): Promise<void> {
	const setting = await AsyncStorage.getItem('userInfo');
	const response = JSON.parse(String(setting)) as IOrganizedInfoResponse;

	const updatedInfo: IOrganizedInfoResponse = {
		...response,
		role: {
			...response.role,
			team,
		},
	};

	await AsyncStorage.setItem('userInfo', JSON.stringify(updatedInfo));
}

export { setCurrentTeam };
