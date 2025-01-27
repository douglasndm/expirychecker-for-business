import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@teams/Locales';

import { captureException } from '@services/ExceptionsHandler';

import { createAccount } from '@teams/Functions/Auth/Account';
import { createSeassion } from '@teams/Utils/Auth/Session';

import Header from '@components/Header';
import Input from '@components/InputText';
import Button from '@components/Button';

import { FormContainer } from '../Login/Form/styles';
import { Container, PageContent } from './styles';

const CreateAccount: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isMounted, setIsMounted] = useState(true);

	const [name, setName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');

	const [isCreating, setIsCreating] = useState<boolean>(false);

	const handleNameChange = useCallback(
		(value: string) => setName(value.trim()),
		[]
	);
	const handleLastNameChange = useCallback(
		(value: string) => setLastName(value.trim()),
		[]
	);
	const handleEmailChange = useCallback(
		(value: string) => setEmail(value.trim()),
		[]
	);

	const handlePasswordChange = useCallback(
		(value: string) => setPassword(value),
		[]
	);

	const handlePasswordConfirmChange = useCallback(
		(value: string) => setPasswordConfirm(value),
		[]
	);

	const handleCreateAccount = useCallback(async () => {
		if (!isMounted) return;
		const schema = Yup.object().shape({
			name: Yup.string().required(
				strings.View_CreateAccount_Alert_Error_EmptyName
			),
			lastName: Yup.string().required(
				strings.View_CreateAccount_Alert_Error_EmptyLastName
			),
			email: Yup.string()
				.required(strings.View_CreateAccount_Alert_Error_EmptyEmail)
				.email(strings.View_CreateAccount_Alert_Error_InvalidEmail),
			password: Yup.string()
				.required(strings.View_CreateAccount_Alert_Error_EmptyPassword)
				.min(6),
			passwordConfirm: Yup.string().oneOf(
				[Yup.ref('password'), undefined],
				strings.View_CreateAccount_Alert_Error_InvalidPassConfirm
			),
		});

		try {
			await schema.validate(
				{
					name,
					lastName,
					email,
					password,
					passwordConfirm,
				},
				{ abortEarly: false }
			);
		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				showMessage({
					message: err.errors[0],
					type: 'warning',
				});
			}
			return;
		}

		try {
			setIsCreating(true);

			await createAccount({
				name,
				lastName,
				email,
				password,
			});

			// Here we register the user device
			await createSeassion();

			showMessage({
				message: strings.View_CreateAccount_Alert_Success_Title,
				description: strings.View_CreateAccount_Alert_Success_Message,
				type: 'info',
			});

			reset({
				routes: [{ name: 'VerifyEmail' }],
			});
		} catch (error) {
			if (error instanceof Error)
				if (error.message.includes('auth/email-already-in-use')) {
					showMessage({
						message: strings.API_Error_Code40,
						type: 'warning',
					});
				} else {
					captureException({ error });
				}
		} finally {
			setIsCreating(false);
		}
	}, [email, isMounted, lastName, name, password, passwordConfirm, reset]);

	useEffect(() => {
		return () => {
			setIsMounted(false);
		};
	}, []);

	return (
		<Container>
			<Header title={strings.View_CreateAccount_PageTitle} noDrawer />
			<PageContent>
				<FormContainer>
					<Input
						placeholder={
							strings.View_CreateAccount_Input_Name_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="words"
						value={name}
						onChangeText={handleNameChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Input
						placeholder={
							strings.View_CreateAccount_Input_LastName_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="words"
						value={lastName}
						onChangeText={handleLastNameChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Input
						placeholder={
							strings.View_CreateAccount_Input_Email_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="none"
						value={email}
						onChangeText={handleEmailChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Input
						placeholder={
							strings.View_CreateAccount_Input_Password_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="none"
						isPassword
						value={password}
						onChangeText={handlePasswordChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Input
						placeholder={
							strings.View_CreateAccount_Input_ConfirmPassword_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="none"
						isPassword
						value={passwordConfirm}
						onChangeText={handlePasswordConfirmChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Button
						title={strings.View_CreateAccount_Button_CreateAccount}
						onPress={handleCreateAccount}
						isLoading={isCreating}
					/>
				</FormContainer>
			</PageContent>
		</Container>
	);
};

export default CreateAccount;
