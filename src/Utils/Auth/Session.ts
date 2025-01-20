import messaging from '@react-native-firebase/messaging';

import { getDeviceId } from '@services/DeviceID';

import api from '@teams/Services/API/Config';

import { clearSelectedteam } from '@teams/Functions/Team/SelectedTeam';
import { logoutFirebase } from '@teams/Functions/Auth/Firebase';

export interface AuthResponse {
	id: string;
	name?: string;
	lastName?: string;
	email: string;
	role?: {
		name: 'manager' | 'supervisor' | 'repositor';
		status: 'completed' | 'pending' | null;
		code: string | null;
		team: ITeam;
		store: IStore | null;
	};
}

async function createSeassion(): Promise<AuthResponse> {
	const deviceId = await getDeviceId();
	const token = await messaging().getToken();

	const response = await api.post<AuthResponse>(`/session`, {
		deviceId,
		firebaseToken: token,
	});

	return response.data;
}

async function destroySession(): Promise<void> {
	await clearSelectedteam();
	await logoutFirebase();
}

export { createSeassion, destroySession };
