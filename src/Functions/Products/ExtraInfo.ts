import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface getExtraInformationsForProductResponse {
	availableBrands: IBrand[];
	availableCategories: ICategory[];
	availableStores: IStore[];
}

async function getExtraInfoForProducts(): Promise<getExtraInformationsForProductResponse> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.get<getExtraInformationsForProductResponse>(
		`/team/${currentTeam.id}/products/extrainfo`
	);

	return response.data;
}

export { getExtraInfoForProducts };
