import api from '@teams/Services/API';

import { getCurrentTeam } from '../Settings/CurrentTeam';

async function getUserStore(): Promise<IStore | null> {
	const currentTeam = await getCurrentTeam();
	if (!currentTeam) return null;

	const { data } = await api.get<IStore | null>(`/users/store`, {
		params: {
			team_id: currentTeam.id,
		},
	});

	return data;
}

export { getUserStore };
