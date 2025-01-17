import { startOfDay, parseISO, compareAsc, isDate } from 'date-fns';

import api from '@teams/Services/API/Config';
import { queueRequest } from '@teams/Services/API/RequestQueue';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';
import { sortBatches } from '@utils/Product/Batches';

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

interface sortProductsByBatchesExpDateProps {
	products: Array<IProduct>;
}

export function sortProductsByBatchesExpDate({
	products,
}: sortProductsByBatchesExpDateProps): Array<IProduct> {
	const prodsWithSortedBatchs = products.sort((prod1, prod2) => {
		const batches1 = sortBatches(prod1.batches);
		const batches2 = sortBatches(prod2.batches);

		// if one of the products doesnt have batches it will return
		// the another one as biggest
		if (batches1.length > 0 && batches2.length <= 0) {
			return -1;
		}
		if (batches1.length === 0 && batches2.length === 0) {
			return 0;
		}
		if (batches1.length <= 0 && batches2.length > 0) {
			return 1;
		}

		const batch1ExpDate = startOfDay(batches1[0].exp_date);
		const batch2ExpDate = startOfDay(batches2[0].exp_date);

		if (
			batches1[0].status === 'unchecked' &&
			batches2[0].status === 'checked'
		) {
			return -1;
		}
		if (
			batches1[0].status === 'checked' &&
			batches2[0].status === 'checked'
		) {
			return compareAsc(batch1ExpDate, batch2ExpDate);
		}
		if (
			batches1[0].status === 'checked' &&
			batches2[0].status === 'unchecked'
		) {
			return 1;
		}

		return compareAsc(batch1ExpDate, batch2ExpDate);
	});

	return prodsWithSortedBatchs;
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
