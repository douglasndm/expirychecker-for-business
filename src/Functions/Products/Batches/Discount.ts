import api from '@teams/Services/API/Config';

import { getSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

import AppError from '@shared/Errors/AppError';

interface updateBatchDiscount {
	batch_id: string;
	temp_price: number;
}

export async function updateBatchDiscount({
	batch_id,
	temp_price,
}: updateBatchDiscount): Promise<void> {
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) {
		throw new AppError({
			message: 'Team is not selected',
		});
	}

	const team_id = selectedTeam.userRole.team.id;

	await api.post(`/team/${team_id}/batches/discount`, {
		batch_id,
		temp_price,
	});
}
