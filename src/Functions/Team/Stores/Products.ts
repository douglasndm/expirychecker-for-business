import api from '@teams/Services/API/Config';

import { fixProductsDates } from '@teams/Functions/Products/Products';
import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface getAllProductsFromStoreProps {
	store_id: string;
}

async function getAllProductsFromStore({
	store_id,
}: getAllProductsFromStoreProps): Promise<IProduct[]> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const { data } = await api.get<IProduct[]>(
		`/team/${currentTeam.id}/stores/${store_id}/products`
	);

	const products = fixProductsDates(data);

	return products;
}

export { getAllProductsFromStore };
