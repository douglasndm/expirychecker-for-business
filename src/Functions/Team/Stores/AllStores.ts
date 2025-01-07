import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

async function getAllStoresFromTeam(): Promise<IStore[]> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.get<IStore[]>(`/team/${currentTeam.id}/stores`);

	return response.data;
}

export { getAllStoresFromTeam };
