import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { getCurrentSubscription } from '@teams/Utils/Subscriptions/GetCurrent';

import { AuthResponse } from '@teams/Utils/Auth/Session';

import AppError from '@shared/Errors/AppError';

interface Request {
	firebaseUser: FirebaseAuthTypes.User;
	localUser: AuthResponse;
}

interface IRoleTeam extends IRole {
	team: ITeam;
	store: IStore | null;
}

export interface IOrganizedInfoResponse extends AuthResponse {
	teamSubscription: TeamSubscription | null;
}

async function organizedInfo(info: Request): Promise<IOrganizedInfoResponse> {
	const { id, name, lastName, email, role } = info.localUser;

	let response: IOrganizedInfoResponse = {
		id,
		name,
		lastName,
		email,
		teamSubscription: null,
	};

	if (!role) {
		return response;
	}

	let subscription: TeamSubscription | null = null;

	if (Object.keys(role).length > 0) {
		try {
			const sub = await getCurrentSubscription({
				team_id: role.team.id,
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

		const { status, code } = role;

		const teamResponse: IRoleTeam = {
			name: role.name,
			status: status,
			code: code,
			team: role.team,
			store: role.store,
		};

		response = {
			...response,
			role: teamResponse,
			teamSubscription: subscription,
		};
	}

	return response;
}

export { organizedInfo };
