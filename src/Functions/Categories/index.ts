import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

export async function getAllCategoriesFromTeam(): Promise<Array<ICategory>> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.get<Array<ICategory>>(
		`/team/${currentTeam.id}/categories`
	);

	return response.data;
}

interface getCategoryProps {
	category_id: string;
}

export async function getCategory({
	category_id,
}: getCategoryProps): Promise<ICategory> {
	const categories = await getAllCategoriesFromTeam();

	const cat = categories.find(c => c.id === category_id);

	if (!cat) {
		throw new Error('Category not found');
	}

	return cat;
}

interface createCategoryProps {
	name: string;
}

export async function createCategory({
	name,
}: createCategoryProps): Promise<ICategory> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.post<ICategory>(
		`/team/${currentTeam.id}/categories`,
		{
			name,
		}
	);

	return response.data;
}

interface updateCategoryProps {
	category: ICategory;
}
export async function updateCategory({
	category,
}: updateCategoryProps): Promise<ICategory> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.put<ICategory>(
		`/team/${currentTeam.id}/categories/${category.id}`,
		{
			name: category.name,
		}
	);

	return response.data;
}

interface deleteCategoryProps {
	category_id: string;
}

export async function deleteCategory({
	category_id,
}: deleteCategoryProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.delete(`/team/${currentTeam.id}/categories/${category_id}`);
}
