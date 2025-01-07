import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '../Settings/CurrentTeam';

interface Props {
	team_id?: string;
}

// this function will get the current subscription on server
// and it will also force update it on revenuecat if there is not subscription
async function getCurrentSubscription({
	team_id,
}: Props): Promise<ITeamSubscription | null> {
	let teamId = team_id;

	if (!teamId) {
		const currentTeam = await getCurrentTeam();
		if (!currentTeam) return null;

		teamId = currentTeam.id;
	}

	const { data } = await api.get<ITeamSubscription>(
		`/team/${teamId}/subscriptions`
	);

	return data || null;
}

export { getCurrentSubscription };
