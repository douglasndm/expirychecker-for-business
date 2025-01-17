import auth, { firebase } from '@react-native-firebase/auth';

import api from '@teams/Services/API/Config';

interface createAccountProps {
	name: string;
	lastName: string;
	email: string;
	password: string;
}

export async function createAccount({
	name,
	lastName,
	email,
	password,
}: createAccountProps): Promise<IUser> {
	const { user } = await auth().createUserWithEmailAndPassword(
		email,
		password
	);

	await user.sendEmailVerification();

	await user.updateProfile({
		displayName: `${name} ${lastName}`,
	});

	const response = await api.post<IUser>('/users', {
		firebaseUid: user.uid,
		email,
		name,
		lastName,
		password,
	});

	return response.data;
}

export async function isEmailConfirmed(): Promise<boolean> {
	await auth().currentUser?.reload();
	const confirmed = auth().currentUser?.emailVerified;

	return confirmed || false;
}

export async function resendConfirmationEmail(): Promise<void> {
	const user = auth().currentUser;

	await user?.sendEmailVerification();
}

interface updateUserProps {
	name: string;
	lastName: string;
	password: string | undefined;
	passwordConfirm: string | undefined;
}

export async function updateUser({
	name,
	lastName,
	password,
	passwordConfirm,
}: updateUserProps): Promise<void> {
	await auth().currentUser?.updateProfile({
		displayName: name,
	});

	await api.put<IUser>(`/users`, {
		name,
		lastName,
		password,
		passwordConfirm,
	});
}

interface updateEmailProps {
	email: string;
}

export async function updateEmail({ email }: updateEmailProps): Promise<void> {
	await auth().currentUser?.verifyBeforeUpdateEmail(email);
}

interface updatePasswordProps {
	password: string;
	newPassword: string;
}

export async function updatePassword({
	password,
	newPassword,
}: updatePasswordProps): Promise<void> {
	const user = auth().currentUser;

	if (!user || !user?.email) {
		throw new Error("User doesn't have an Email");
	}

	const provider = firebase.auth.EmailAuthProvider;
	const authCredential = provider.credential(user.email, password);

	await user.reauthenticateWithCredential(authCredential);

	// should ask user reauth
	await user.updatePassword(newPassword);

	await api.put<IUser>(`/users`, {
		password,
	});
}
