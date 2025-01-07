import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface createStoreProps {
	name: string;
}

async function createStore({ name }: createStoreProps): Promise<IStore> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.post<IStore>(`/team/${currentTeam.id}/stores`, {
		name,
	});

	return response.data;
}

export { createStore };
