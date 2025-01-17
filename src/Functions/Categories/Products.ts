import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import { fixProductsDates } from '../Products/Products';

interface getAllProductsFromCategoryProps {
	category_id: string;
}

interface getAllProductsFromCategoryResponse {
	category_name: string;
	products: Array<IProduct>;
}

export async function getAllProductsFromCategory({
	category_id,
}: getAllProductsFromCategoryProps): Promise<getAllProductsFromCategoryResponse> {
	const currentTeam = await getCurrentTeam();

	const { data } = await api.get<getAllProductsFromCategoryResponse>(
		`/team/${currentTeam.id}/categories/${category_id}/products`
	);

	const products = fixProductsDates(data.products);

	return {
		category_name: data.category_name,
		products: products,
	};
}
