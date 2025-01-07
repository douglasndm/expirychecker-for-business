import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '../Settings/CurrentTeam';

async function clearSubscription(): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (currentTeam) {
		await api.delete(`/team/${currentTeam.id}/subscriptions`);
	}
}

export { clearSubscription };
