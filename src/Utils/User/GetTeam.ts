import api from '@teams/Services/API/Config';

interface IResponse {
	code: string | null;
	status: 'pending' | 'completed' | null;
	role: 'manager' | 'supervisor' | 'repositor';
	team: ITeam;
}
async function getUserTeam(): Promise<IResponse | null> {
	const { data } = await api.get<IResponse>(`/users/team`);

	return data;
}

export { getUserTeam };
