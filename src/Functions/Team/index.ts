import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import { clearSelectedteam } from './SelectedTeam';

interface createTeamProps {
	name: string;
}

export async function createTeam({ name }: createTeamProps): Promise<ITeam> {
	const response = await api.post<ITeam>(`/team`, {
		name,
	});

	return response.data;
}

interface editTeamProps {
	name: string;
}

export async function editTeam({ name }: editTeamProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	await api.put<ITeam>(`/team/${currentTeam.id}`, {
		name,
	});
}

export async function deleteTeam(): Promise<void> {
	const currentTeam = await getCurrentTeam();

	await clearSelectedteam();
	await api.delete(`/team/${currentTeam.id}`);
}
