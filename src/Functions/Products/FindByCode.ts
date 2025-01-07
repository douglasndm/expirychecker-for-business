import api from '@teams/Services/API/Config';

interface Response {
	name: string;
	code: string;
}

async function findProductByCode(code: string): Promise<Response | null> {
	const response = await api.get<Response>(`/products/search?query=${code}`);

	if (response.data !== null) return response.data;

	return null;
}

export { findProductByCode };
