import api from '@teams/Services/API/Config';

async function deleteSubscription(team_id: string): Promise<void> {
	await api.delete(`/team/${team_id}/subscriptions`);
}

export { deleteSubscription };
