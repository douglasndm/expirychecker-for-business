import api from '@teams/Services/API/Config';
import { queueRequest } from '@teams/Services/API/RequestQueue';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import { fixProductsDates } from './Products/Products';

export async function getAllBrands(): Promise<Array<IBrand>> {
	const currentTeam = await getCurrentTeam();

	const response = await queueRequest<IBrand[]>(
		`/team/${currentTeam.id}/brands`
	);

	return response;
}

export async function createBrand({
	brandName,
}: createBrandProps): Promise<IBrand> {
	const currentTeam = await getCurrentTeam();

	const response = await api.post<IBrand>(`/team/${currentTeam.id}/brands`, {
		name: brandName,
	});

	return response.data;
}

export async function updateBrand({
	brand,
}: updateBrandProps): Promise<IBrand> {
	const currentTeam = await getCurrentTeam();

	const response = await api.put<IBrand>(`/team/${currentTeam.id}/brands`, {
		brand_id: brand.id,
		name: brand.name,
	});

	return response.data;
}

interface getAllProductsByBrandProps {
	brand_id: string;
}

export async function getAllProductsByBrand({
	brand_id,
}: getAllProductsByBrandProps): Promise<Array<IProduct>> {
	const currentTeam = await getCurrentTeam();

	const response = await queueRequest<Array<IProduct>>(
		`/team/${currentTeam.id}/brands/${brand_id}/products`
	);

	const products = fixProductsDates(response);

	return products;
}

export async function deleteBrand({
	brand_id,
}: deleteBrandProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	await api.delete(`/team/${currentTeam.id}/brands/${brand_id}`);
}
