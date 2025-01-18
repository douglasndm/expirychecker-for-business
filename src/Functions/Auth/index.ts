import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import strings from '@teams/Locales';

import { createSeassion, AuthResponse } from '@teams/Utils/Auth/Session';

import { loginFirebase } from './Firebase';

interface loginProps {
	email: string;
	password: string;
}

interface IResponse {
	firebaseUser: FirebaseAuthTypes.User;
	localUser: AuthResponse;
}

export async function login({
	email,
	password,
}: loginProps): Promise<IResponse> {
	try {
		const fuser = await loginFirebase({
			email,
			password,
		});

		// Here we register the user device
		const user = await createSeassion();

		const response: IResponse = {
			firebaseUser: fuser,
			localUser: user,
		};

		return response;
	} catch (err) {
		if (err instanceof Error) {
			let message: string | null = null;

			if (err.message.includes('auth/wrong-password')) {
				message = strings.View_Login_Error_WrongEmailOrPassword;
			} else if (err.message.includes('auth/user-not-found')) {
				message = strings.View_Login_Error_WrongEmailOrPassword;
			} else if (err.message.includes('auth/network-request-failed')) {
				message = strings.View_Login_Error_NetworkError;
			}

			if (message !== null) {
				throw new Error(message);
			}
		}

		throw err;
	}
}
