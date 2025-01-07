import auth, { firebase } from '@react-native-firebase/auth';

import api from '@teams/Services/API/Config';

interface deleteUserProps {
	password: string;
}

export async function deleteUser({ password }: deleteUserProps): Promise<void> {
	const user = auth().currentUser;

	if (!user || !user?.email) {
		throw new Error("User doesn't have an Email");
	}

	const provider = firebase.auth.EmailAuthProvider;
	const authCredential = provider.credential(user.email, password);

	await user.reauthenticateWithCredential(authCredential);

	await api.delete('/users');

	if (user) {
		await user.delete();
	}
}
