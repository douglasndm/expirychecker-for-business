import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@teams/Locales';

import { captureException } from '@services/ExceptionsHandler';

import { updateUser, updatePassword } from '@teams/Functions/Auth/Account';
import { getUser } from '@teams/Functions/User/List';

import Header from '@components/Header';
import Input from '@components/InputText';
import Loading from '@components/Loading';

import {
	Container,
	Content,
	InputGroupTitle,
	InputGroup,
	InputTextTip,
} from './styles';

const User: React.FC = () => {
	const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);

	const [name, setName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [newPasswordConfi, setNewPasswordConfi] = useState<string>('');

	const [nameError, setNameError] = useState<boolean>(false);
	const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
	const [newPasswordConfiError, setNewPasswordConfiError] =
		useState<boolean>(false);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const user = await getUser();

			if (user.name) setName(user.name);
			if (user.last_name) setLastName(user.last_name);
		} catch (err) {
			if (err instanceof Error) {
				captureException(err);
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleUpdate = useCallback(async () => {
		setIsUpdating(true);

		try {
			const schema = Yup.object().shape({
				name: Yup.string().required(
					strings.View_Profile_Alert_Error_EmptyName
				),
				lastName: Yup.string().required(),
			});

			await schema.validate({ name, lastName });

			if (password) {
				const schemaPass = Yup.object().shape({
					newPassword: Yup.string()
						.required(
							strings.View_Profile_Alert_Error_EmptyPassword
						)
						.min(6),
					newPasswordConfi: Yup.string().oneOf(
						[Yup.ref('newPassword'), undefined],
						strings.View_Profile_Alert_Error_WrongPasswordConfirmation
					),
				});

				await schemaPass.validate({ newPassword, newPasswordConfi });
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
			setIsUpdating(false);
			return;
		}

		if (password) {
			try {
				await updatePassword({
					password,
					newPassword,
				});
			} catch (err) {
				if (err instanceof Error) {
					let error = err.message;

					if (err.message.includes('auth/wrong-password')) {
						error =
							strings.View_Profile_Alert_Error_WrongCurrentPassword;
					}

					showMessage({
						message: error,
						type: 'danger',
					});
					setIsUpdating(false);
					return;
				}
			}
		}

		try {
			await updateUser({
				name,
				lastName,
				password: newPassword,
				passwordConfirm: newPasswordConfi,
			});

			showMessage({
				message: strings.View_Profile_Alert_Success,
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsUpdating(false);
		}
	}, [lastName, name, newPassword, newPasswordConfi, password, pop]);

	const handleNameChange = useCallback((value: string) => {
		setName(value);
		setNameError(false);
	}, []);

	const handleLastNameChange = useCallback((value: string) => {
		setLastName(value);
		setNameError(false);
	}, []);

	const handlePasswordChange = useCallback((value: string) => {
		setPassword(value);
	}, []);

	const handleNewPasswordChange = useCallback((value: string) => {
		setNewPassword(value);
		setNewPasswordError(false);
	}, []);

	const handleNewPasswordConfiChange = useCallback((value: string) => {
		setNewPasswordConfi(value);
		setNewPasswordConfiError(false);
	}, []);

	useEffect(() => {
		loadData();
	}, []);

	return (
		<Container>
			<Header
				title={strings.View_Profile_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'content-save-outline',
						onPress: handleUpdate,
						disabled: isLoading || isUpdating,
					},
				]}
			/>

			{isLoading || isUpdating ? (
				<Loading />
			) : (
				<Content>
					<InputGroup>
						<Input
							value={name}
							onChangeText={handleNameChange}
							placeholder={
								strings.View_Profile_InputText_Placeholder_Name
							}
							hasError={nameError}
						/>
					</InputGroup>
					{nameError && (
						<InputTextTip>
							{strings.View_Profile_Alert_Tip_EmptyName}
						</InputTextTip>
					)}

					<InputGroup>
						<Input
							placeholder={
								strings.View_Profile_InputText_Placeholder_LastName
							}
							value={lastName}
							onChangeText={handleLastNameChange}
						/>
					</InputGroup>

					<InputGroupTitle>
						{strings.View_Profile_Label_PasswordGroup}
					</InputGroupTitle>
					<InputGroup>
						<Input
							placeholder={
								strings.View_Profile_InputText_Placeholder_Password
							}
							value={password}
							onChangeText={handlePasswordChange}
							isPassword
						/>
					</InputGroup>

					<InputGroup>
						<Input
							placeholder={
								strings.View_Profile_InputText_Placeholder_NewPassword
							}
							value={newPassword}
							onChangeText={handleNewPasswordChange}
							hasError={newPasswordError}
							isPassword
						/>
					</InputGroup>
					{newPasswordError && (
						<InputTextTip>
							{strings.View_Profile_Alert_Tip_EmptyPassword}
						</InputTextTip>
					)}

					<InputGroup>
						<Input
							placeholder={
								strings.View_Profile_InputText_Placeholder_ConfirNewPassword
							}
							value={newPasswordConfi}
							onChangeText={handleNewPasswordConfiChange}
							hasError={newPasswordConfiError}
							isPassword
						/>
					</InputGroup>
					{newPasswordConfiError && (
						<InputTextTip>
							{
								strings.View_Profile_Alert_Tip_EmptyPasswordConfirm
							}
						</InputTextTip>
					)}
				</Content>
			)}
		</Container>
	);
};

export default User;
