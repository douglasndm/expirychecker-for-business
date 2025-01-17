import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

export async function getBatch({
	batch_id,
}: getBatchProps): Promise<getBatchResponse> {
	const currentTeam = await getCurrentTeam();

	const response = await api.get<IBatchResponse>(
		`/team/${currentTeam.id}/batches/${batch_id}`
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

	const currentTeam = await getCurrentTeam();

	const response = await api.post<IBatch>(
		`/team/${currentTeam.id}/batches`,
		body
	);

	return response.data;
}

export async function updateBatch({
	batch,
}: updatebatchProps): Promise<IBatch> {
	const currentTeam = await getCurrentTeam();

	const response = await api.put<IBatch>(
		`/team/${currentTeam.id}/batches/${batch.id}`,
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
	const currentTeam = await getCurrentTeam();

	await api.delete<IBatch>(`/team/${currentTeam.id}/batches/${batch_id}`);
}
