import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { getCurrentSubscription } from '@teams/Utils/Subscriptions/GetCurrent';

import { SessionResponse } from '@teams/Functions/Auth/Session';

import AppError from '@shared/Errors/AppError';

interface Request {
	firebaseUser: FirebaseAuthTypes.User;
	localUser: SessionResponse;
}

interface ITeamRole extends ITeam {
	subscription: TeamSubscription | null;
	role: IRole;
}

export interface IOrganizedResponse {
	id: string;
	name?: string | null;
	lastName?: string | null;
	email: string;

	team?: ITeamRole;
}

async function organizedInfo(info: Request): Promise<IOrganizedResponse> {
	const { team } = info.localUser;

	let response: IOrganizedResponse = {
		id: info.localUser.id,
		email: info.localUser.email,
		name: info.localUser.name,
		lastName: info.localUser.lastName,
	};

	if (!team) {
		return response;
	}

	let subscription: TeamSubscription | null = null;

	if (Object.keys(team).length > 0) {
		try {
			const sub = await getCurrentSubscription({
				team_id: team.team.id,
			});

			subscription = sub;
		} catch (error) {
			if (error instanceof AppError) {
				if (error.errorCode === 19) {
					subscription = null;
				} else {
					throw error;
				}
			} else {
				throw error;
			}
		}

		const { status, code } = team;

		const teamResponse: ITeamRole = {
			id: team.team.id,
			name: team.team.name,
			subscription,
			role: {
				role: team.role.toLowerCase(),
				status: status ? status.toLowerCase() : null,
				code: code ? code : null,
			},
		};

		response = {
			...response,
			team: teamResponse,
		};
	}

	return response;
}

export { organizedInfo };
