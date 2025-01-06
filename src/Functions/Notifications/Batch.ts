import api from '@teams/Services/API';

import { getSelectedTeam } from '../Team/SelectedTeam';

import AppError from '@shared/Errors/AppError';

interface sendBatchNotification {
	batch_id: string;
}

export async function sendBatchNotification({
	batch_id,
}: sendBatchNotification): Promise<void> {
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) {
		throw new AppError({
			message: 'Team is not selected',
		});
	}

	const team_id = selectedTeam.userRole.team.id;

	await api.post(`/team/${team_id}/batches/notifications/${batch_id}`);
}
