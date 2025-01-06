import api from '@teams/Services/API';

interface getUserResponse {
	id: string;
	fid: string;
	email: string;
	name: string | null;
	last_name: string | null;
	role?: {
		role: 'manager' | 'supervisor' | 'repositor';
		code: string | null;
		status: string | null;
		team: {
			id: string;
			name: string;
			subscriptions?: [
				{
					expireIn: string;
					membersLimit: number;
				}
			];
		};
	};
	store: {
		id: string;
		name: string;
	} | null;
}

async function getUser(): Promise<getUserResponse> {
	const user = await api.get<getUserResponse>('/users');

	return user.data;
}

export { getUser };
