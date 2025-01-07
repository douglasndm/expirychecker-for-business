import api from '@teams/Services/API/Config';

import { getSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

import AppError from '@shared/Errors/AppError';

export async function getBatch({
	batch_id,
}: getBatchProps): Promise<getBatchResponse> {
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) {
		throw new AppError({
			message: 'Team is not selected',
		});
	}

	const team_id = selectedTeam.userRole.team.id;

	const response = await api.get<IBatchResponse>(
		`/team/${team_id}/batches/${batch_id}`
	);

	const responseData: getBatchResponse = {
		product: response.data.product,
		batch: response.data as IBatch,
	};
	return responseData;
}

export async function createBatch({
	productId,
	batch,
}: createBatchProps): Promise<IBatch> {
	let body: any = {
		product_id: productId,
		name: batch.name,
		exp_date: batch.exp_date,
		amount: batch.amount,
		status: batch.status,
	};

	if (batch.price) {
		body = {
			...body,
			price: batch.price,
		};
	}
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) {
		throw new AppError({
			message: 'Team is not selected',
		});
	}

	const team_id = selectedTeam.userRole.team.id;

	const response = await api.post<IBatch>(`/team/${team_id}/batches`, body);

	return response.data;
}

export async function updateBatch({
	batch,
}: updatebatchProps): Promise<IBatch> {
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) {
		throw new AppError({
			message: 'Team is not selected',
		});
	}

	const team_id = selectedTeam.userRole.team.id;
	const response = await api.put<IBatch>(
		`/team/${team_id}/batches/${batch.id}`,
		{
			name: batch.name,
			exp_date: batch.exp_date,
			amount: batch.amount,
			price: batch.price,
			status: batch.status,
		}
	);

	return response.data;
}

export async function deleteBatch({
	batch_id,
}: deleteBatchProps): Promise<void> {
	const selectedTeam = await getSelectedTeam();

	if (!selectedTeam) {
		throw new AppError({
			message: 'Team is not selected',
		});
	}

	const team_id = selectedTeam.userRole.team.id;

	await api.delete<IBatch>(`/team/${team_id}/batches/${batch_id}`);
}
