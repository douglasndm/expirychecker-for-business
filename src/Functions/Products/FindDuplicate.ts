import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface isProductDuplicateProps {
	name: string;
	code?: string;
	store_id?: string;
}

interface isProductDuplicateResponse {
	isDuplicate: boolean;
	product_id?: string;
}

async function findDuplicate({
	name,
	code,
	store_id,
}: isProductDuplicateProps): Promise<isProductDuplicateResponse> {
	const currentTeam = await getCurrentTeam();

	const response = await api.get<isProductDuplicateResponse>(
		`/team/${currentTeam.id}/products/duplicate`,
		{
			name,
			code,
			store_id,
		}
	);

	return response.data;
}

export { findDuplicate };
