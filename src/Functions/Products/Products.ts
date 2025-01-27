import { parseISO, isDate } from 'date-fns';

import api from '@teams/Services/API/Config';
import { queueRequest } from '@teams/Services/API/RequestQueue';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface searchProductsProps {
	removeCheckedBatches?: boolean;
	query: string;
}

interface ISearchResponse {
	page: number;
	per_page: number;
	total: number;
	products: IProduct[];
}

interface getAllProductsProps {
	removeCheckedBatches?: boolean;
	sortByBatches?: boolean;
	page?: number;
}

function convertDate(date: string | Date): Date {
	if (isDate(date)) {
		return date as Date;
	}
	return parseISO(String(date));
}

export function fixProductsDates(products: Array<IProduct>): Array<IProduct> {
	return products.map(prod => ({
		...prod,
		created_at: convertDate(prod.created_at),
		updated_at: convertDate(prod.updated_at),
		batches: prod.batches.map(batch => ({
			...batch,
			exp_date: convertDate(batch.exp_date),
			created_at: convertDate(batch.created_at),
			updated_at: convertDate(batch.updated_at),
		})),
	}));
}

export async function getAllProducts({
	removeCheckedBatches = true,
	sortByBatches = true,
	page,
}: getAllProductsProps): Promise<IProduct[]> {
	const currentTeam = await getCurrentTeam();

	const data = await queueRequest<IAllTeamProducts>(
		`/team/${currentTeam.id}/products`,
		{
			params: {
				removeCheckedBatches,
				sortByBatches,
				page,
			},
		}
	);

	const products = fixProductsDates(data.products);

	return products;
}

async function searchProducts(props: searchProductsProps): Promise<IProduct[]> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const { removeCheckedBatches, query } = props;

	const data = await queueRequest<ISearchResponse>(
		`/team/${currentTeam.id}/products/search`,
		{
			params: {
				removeCheckedBatches: removeCheckedBatches || false,
				sortByBatches: true,
				search: query,
			},
		}
	);

	const products = fixProductsDates(data.products);

	return products;
}

interface deleteManyProductsProps {
	productsIds: Array<string>;
}
export async function deleteManyProducts({
	productsIds,
}: deleteManyProductsProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.delete(`/team/${currentTeam.id}/products`, {
		data: {
			productsIds,
		},
	});
}

export { searchProducts };
