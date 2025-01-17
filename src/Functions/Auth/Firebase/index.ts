import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface loginFirebaseProps {
	email: string;
	password: string;
}

export async function loginFirebase({
	email,
	password,
}: loginFirebaseProps): Promise<FirebaseAuthTypes.User> {
	const { user } = await auth().signInWithEmailAndPassword(email, password);

	return user;
}

export async function logoutFirebase(): Promise<void> {
	const user = auth().currentUser;

	if (user) {
		await auth().signOut();
	}
}
