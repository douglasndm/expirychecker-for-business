import messaging from '@react-native-firebase/messaging';

import { getDeviceId } from '@services/DeviceID';

import api from '@teams/Services/API/Config';

import { clearSelectedteam } from '../Team/SelectedTeam';
import { logoutFirebase } from './Firebase';

export interface SessionResponse {
	id: string;
	name: string | null;
	lastName: string | null;
	firebaseUid: string;
	email: string;
	team?: {
		role: string;
		code: string;
		status: string;
		team: {
			id: string;
			name: string;
		};
	};
}

async function createSeassion(): Promise<SessionResponse> {
	const deviceId = await getDeviceId();

	const token = await messaging().getToken();

	const response = await api.post<SessionResponse>(`/sessions`, {
		deviceId,
		firebaseToken: token,
	});

	return response.data;
}

export async function destroySession(): Promise<void> {
	await clearSelectedteam();
	await logoutFirebase();
}

export { createSeassion };
