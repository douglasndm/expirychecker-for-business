import * as Yup from 'yup';

import strings from '@teams/Locales';

import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

export async function getAllUsersFromTeam(): Promise<Array<IUserInTeam>> {
	const currentTeam = await getCurrentTeam();

	const response = await api.get<Array<IUserInTeam>>(
		`/team/${currentTeam.id}/users`
	);

	return response.data;
}

interface putUserInTeamProps {
	user_email: string;
}

interface putUserInTeamResponse {
	user: IUser;
	team: ITeam;
	role: string;
	code: string;
	status: string;
}

export async function putUserInTeam({
	user_email,
}: putUserInTeamProps): Promise<putUserInTeamResponse> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.post<putUserInTeamResponse>(
		`/team/${currentTeam.id}/manager/user`,
		{
			email: user_email,
		}
	);

	return response.data;
}

interface IEnterTeamCode {
	code: string;
	team_id: string;
}

export async function enterTeamCode({
	code,
	team_id,
}: IEnterTeamCode): Promise<void> {
	const schema = Yup.object().shape({
		code: Yup.string().required().min(5),
		team_id: Yup.string().required().uuid(),
	});

	if (!(await schema.isValid({ code, team_id }))) {
		throw new Error('Informations are not valid');
	}

	try {
		await api.post<putUserInTeamResponse>(`/team/${team_id}/join`, {
			code,
		});
	} catch (err) {
		if (err.response.data.message === 'Code is not valid') {
			throw new Error(strings.Function_Team_JoinTeam_InvalidCode);
		} else {
			throw err;
		}
	}
}

interface removeUserFromTeamProps {
	user_id: string;
}

export async function removeUserFromTeam({
	user_id,
}: removeUserFromTeamProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.delete(`/team/${currentTeam.id}/manager/user/${user_id}`);
}
