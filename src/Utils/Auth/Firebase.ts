import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface loginProps {
	email: string;
	password: string;
}

async function loginFirebase({
	email,
	password,
}: loginProps): Promise<FirebaseAuthTypes.User> {
	const { user } = await auth().signInWithEmailAndPassword(email, password);

	return user;
}

async function logoutFirebase(): Promise<void> {
	const user = auth().currentUser;

	if (user) {
		await auth().signOut();
	}
}

export { loginFirebase, logoutFirebase };
