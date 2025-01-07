import Purchases from '@services/RevenueCat';
import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import { getSelectedTeam } from './SelectedTeam';

async function setup() {
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) return;
	if (selectedTeam && selectedTeam.userRole.role.toLowerCase() !== 'manager')
		return;

	if (selectedTeam) {
		await Purchases.logIn(selectedTeam.userRole.team.id);
	}
}

async function getTeamSubscription(): Promise<ITeamSubscription> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.get<ITeamSubscription>(
		`/team/${currentTeam.id}/subscriptions`
	);

	return response.data;
}

async function deleteTeamSubscription(): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.delete(`/team/${currentTeam.id}/subscriptions`);
}

async function isSubscriptionActive(): Promise<boolean> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.get<Subscription[]>(
		`/team/${currentTeam.id}/subscriptions/store`
	);

	const anyActive = response.data.find(
		sub => sub.subscription.unsubscribe_detected_at === null
	);

	return !!anyActive;
}

setup();

export { getTeamSubscription, deleteTeamSubscription, isSubscriptionActive };
