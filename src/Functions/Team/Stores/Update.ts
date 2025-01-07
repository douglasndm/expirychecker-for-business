import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface updateStoreProps {
	name: string;
	store_id: string;
}

async function updateStore({
	name,
	store_id,
}: updateStoreProps): Promise<IStore> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.put<IStore>(
		`/team/${currentTeam.id}/stores/${store_id}`,
		{
			name,
		}
	);

	return response.data;
}

export { updateStore };
