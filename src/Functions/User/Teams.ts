import api from '@teams/Services/API/Config';

export interface UserTeamsResponse {
	id: string;
	name: string;
	lastTimeChecked: string;
	role: string;
	subscription: {
		name: string;
		subscription: {
			expires_date: string;
			purchase_date: string;
			store: string;
			unsubscribe_detected_at: string | null;
		};
	} | null;
}

export async function getUserTeams(): Promise<Array<UserTeamsResponse>> {
	const response = await api.get<Array<UserTeamsResponse>>(`/user/teams`);

	return response.data;
}
