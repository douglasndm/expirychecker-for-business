import auth from '@react-native-firebase/auth';

import strings from '@teams/Locales';

interface recoveryPasswordProps {
	email: string;
}

export async function recoveryPassword({
	email,
}: recoveryPasswordProps): Promise<void> {
	try {
		await auth().sendPasswordResetEmail(email);
	} catch (err) {
		if (err instanceof Error) {
			if (err.message.includes('auth/user-not-found')) {
				throw Error(strings.API_Error_Code18);
			}
		}
		throw err;
	}
}
