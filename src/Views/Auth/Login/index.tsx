import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BootSplash from 'react-native-bootsplash';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { login } from '@teams/Functions/Auth';
import { getTeamPreferences } from '@teams/Functions/Team/Preferences';
import {
	setSelectedTeam,
	getSelectedTeam,
} from '@teams/Functions/Team/SelectedTeam';

import { setCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import Loading from '@components/Loading';
import Input from '@components/InputText';
import Button from '@components/Button';

import Footer from './Footer';

import {
	Container,
	Content,
	LogoContainer,
	Logo,
	LogoTitle,
	FormContainer,
	FormTitle,
	LoginForm,
	ForgotPasswordText,
} from './styles';

const Login: React.FC = () => {
	const { navigate, reset } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoging, setIsLoging] = useState<boolean>(false);

	const handleNavigate = useCallback(async () => {
		try {
			setIsLoading(true);

			let routeName: 'Home' | 'ViewTeam' | 'TeamList' = 'Home';

			const user = auth().currentUser;

			const selectedTeam = await getSelectedTeam();

			if (user) {
				if (selectedTeam) {
					const { team, role } = selectedTeam.userRole;

					if (!team.isActive) {
						if (role === 'manager') {
							routeName = 'ViewTeam';
						} else {
							routeName = 'TeamList';
						}
					}
				} else {
					routeName = 'TeamList';
				}

				reset({
					routes: [
						{
							name: routeName,
						},
					],
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, [reset]);

	const handleLogin = useCallback(async () => {
		const schema = Yup.object().shape({
			email: Yup.string().required().email(),
			password: Yup.string().required(),
		});

		try {
			await schema.validate({ email, password });
		} catch (err) {
			showMessage({
				message: strings.View_Login_InputText_EmptyText,
				type: 'warning',
			});
			return;
		}

		try {
			setIsLoging(true);

			// Makes login with Firebase after that the subscriber event will handle
			const user = await login({ email, password });

			if (user) {
				const userRole = user.localUser.team;

				// user has a role in a team
				if (userRole && Object.keys(userRole).length > 0) {
					const { status, role } = userRole;
					const { team } = userRole;

					const onTeam =
						status && status.toLowerCase() === 'completed';
					const teamRole = role ? role.toLowerCase() : null;

					if (onTeam || teamRole === 'manager') {
						const teamPreferences = await getTeamPreferences({
							team_id: team.id,
						});

						await setSelectedTeam({
							userRole,
							teamPreferences,
						});

						await setCurrentTeam(team);

						if (teamContext.reload) {
							teamContext.reload();
						}
					}
				}
			}
			handleNavigate();
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsLoging(false);
		}
	}, [email, handleNavigate, password, teamContext]);

	const handleEmailChange = useCallback(
		(value: string) => setEmail(value.trim()),
		[]
	);

	const handlePasswordChange = useCallback(
		(value: string) => setPassword(value),
		[]
	);

	const handleNavigateToForgotPass = useCallback(() => {
		navigate('ForgotPassword');
	}, [navigate]);

	useEffect(() => {
		try {
			const user = auth().currentUser;

			BootSplash.hide({ fade: true });

			if (user) {
				handleNavigate();
			}
		} finally {
			setIsLoading(false);
		}
	}, [handleNavigate]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<LogoContainer>
				<Logo />
				<LogoTitle>
					{strings.View_Login_Business_Title.toUpperCase()}
				</LogoTitle>
			</LogoContainer>
			<Content>
				<FormContainer>
					<FormTitle>{strings.View_Login_FormLogin_Title}</FormTitle>
					<LoginForm>
						<Input
							value={email}
							onChangeText={handleEmailChange}
							placeholder={
								strings.View_Login_InputText_Email_Placeholder
							}
							autoCorrect={false}
							autoCapitalize="none"
							contentStyle={{ marginBottom: 10 }}
						/>

						<Input
							value={password}
							onChangeText={handlePasswordChange}
							placeholder={
								strings.View_Login_InputText_Password_Placeholder
							}
							autoCorrect={false}
							autoCapitalize="none"
							isPassword
						/>

						<ForgotPasswordText
							onPress={handleNavigateToForgotPass}
						>
							{strings.View_Login_Label_ForgotPassword}
						</ForgotPasswordText>
					</LoginForm>

					<Button
						title={strings.View_Login_Button_SignIn}
						onPress={handleLogin}
						isLoading={isLoging}
					/>
				</FormContainer>
			</Content>

			<Footer />
		</Container>
	);
};

export default Login;
