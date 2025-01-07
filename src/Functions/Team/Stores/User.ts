import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface removeUserFromStoreProps {
	user_id: string;
	store_id: string;
}

interface addUserToStoreProps {
	user_id: string;
	store_id: string;
}

async function addUserToStore({
	user_id,
	store_id,
}: addUserToStoreProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.post(`/team/${currentTeam.id}/stores/${store_id}/users`, {
		user_id,
	});
}

async function removeUserFromStore({
	user_id,
	store_id,
}: removeUserFromStoreProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.delete(`/team/${currentTeam.id}/stores/${store_id}/users`, {
		data: {
			user_id,
		},
	});
}

export { addUserToStore, removeUserFromStore };
