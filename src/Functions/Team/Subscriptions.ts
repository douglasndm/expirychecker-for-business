import Purchases from '@services/RevenueCat';

import api from '@teams/Services/API/Config';
import { queueRequest } from '@teams/Services/API/RequestQueue';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import { getSelectedTeam } from './SelectedTeam';

async function setup() {
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) return;

	const { name } = selectedTeam.userRole;

	if (name !== 'manager') return;

	if (selectedTeam) {
		await Purchases.logIn(selectedTeam.userRole.team.id);
	}
}

async function getTeamSubscription(): Promise<ITeamSubscription> {
	const currentTeam = await getCurrentTeam();

	const response = await queueRequest<ITeamSubscription>(
		`/team/${currentTeam.id}/subscriptions`
	);

	return response;
}

async function deleteTeamSubscription(): Promise<void> {
	const currentTeam = await getCurrentTeam();

	await api.delete(`/team/${currentTeam.id}/subscriptions`);
}

async function isSubscriptionActive(): Promise<boolean> {
	const currentTeam = await getCurrentTeam();

	const response = await queueRequest<Subscription[]>(
		`/team/${currentTeam.id}/subscriptions/store`
	);

	const anyActive = response.find(
		sub => sub.subscription.unsubscribe_detected_at === null
	);

	return !!anyActive;
}

setup();

export { getTeamSubscription, deleteTeamSubscription, isSubscriptionActive };
