import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';
import { removeLocalImage } from '@utils/Images/RemoveLocally';

interface getProductProps {
	productId: string;
}

export async function getProduct({
	productId,
}: getProductProps): Promise<IProduct> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.get<IProduct>(
		`/team/${currentTeam.id}/products/${productId}`
	);

	return response.data;
}

interface createProductProps {
	product: Omit<IProduct, 'id' | 'categories' | 'created_at' | 'updated_at'>;
}

export async function createProduct({
	product,
}: createProductProps): Promise<IProduct> {
	const currentTeam = await getCurrentTeam();

	const response = await api.post<IProduct>(
		`/team/${currentTeam.id}/products`,
		{
			name: product.name,
			code: product.code,
			brand_id: product.brand,
			category_id: product.category,
			store_id: product.store,
		}
	);

	return response.data;
}

interface updateProductProps {
	product: Omit<IProduct, 'batches' | 'created_at' | 'updated_at'>;
}

export async function updateProduct({
	product,
}: updateProductProps): Promise<IProduct> {
	const currentTeam = await getCurrentTeam();

	const response = await api.put<IProduct>(
		`/team/${currentTeam.id}/products/${product.id}`,
		{
			name: product.name,
			code: product.code,
			brand_id: product.brand?.id,
			store_id: product.store?.id,
			category_id: product.category?.id,
		}
	);

	return response.data;
}

interface deleteProductProps {
	product_id: string;
}

export async function deleteProduct({
	product_id,
}: deleteProductProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.delete<IProduct>(
		`/team/${currentTeam.id}/products/${product_id}`
	);
	removeLocalImage(product_id);
}
