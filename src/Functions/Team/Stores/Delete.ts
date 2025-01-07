import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface deleteStoreProps {
	store_id: string;
}

async function deleteStore({ store_id }: deleteStoreProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.delete<IStore>(`/team/${currentTeam.id}/stores/${store_id}`);
}

export { deleteStore };
