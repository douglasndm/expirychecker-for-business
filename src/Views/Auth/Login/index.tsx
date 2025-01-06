import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BootSplash from 'react-native-bootsplash';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { organizedInfo } from '@teams/Utils/User/Login/organizedInfo';

import { login } from '@teams/Functions/Auth';
import { getTeamPreferences } from '@teams/Functions/Team/Preferences';
import { setSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

import { setCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import Loading from '@components/Loading';

import Form from './Form';
import Footer from './Footer';

import { Container, Content, LogoContainer, Logo, LogoTitle } from './styles';

const Login: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [email, setEmail] = useState<string>('suporte@douglasndm.dev');
	const [password, setPassword] = useState<string>('123456');

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoging, setIsLoging] = useState<boolean>(false);

	const resetNavigation = useCallback(
		(value: 'Home' | 'ViewTeam' | 'TeamList') => {
			reset({
				routes: [
					{
						name: value,
					},
				],
			});
		},
		[reset]
	);

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

			const response = await organizedInfo(user);

			// if user has no team
			if (!response.team) {
				resetNavigation('TeamList');
				return;
			} else {
				// if user has a team but it didn't enter the code yet
				if (response.team.role.status !== 'completed') {
					reset({
						routes: [
							{
								name: 'EnterTeam',
								params: {
									userRole: {
										team: response.team,
										code: response.team.role.code,
									},
								},
							},
						],
					});
					return;
				}

				// Now we are setting the current team
				const teamPreferences = await getTeamPreferences({
					team_id: response.team.id,
				});

				await setSelectedTeam({
					userRole: {
						role: response.team.role,
						status: response.team.role.status,
						code: response.team.role.code,
						team: {
							id: response.team.id,
							name: response.team.name,
						},
					},
					teamPreferences,
				});

				await setCurrentTeam({
					id: response.team.id,
					name: response.team.name,
				});

				if (teamContext.reload) {
					teamContext.reload();
				}

				// Check subscription and if user is manager
				if (!response.team.subscription) {
					if (response.team.role.role === 'manager') {
						// Redirect to ViewTeam to manager active the team with a subscription
						resetNavigation('ViewTeam');
						return;
					} else {
						// Redirect to TeamList to users wait manager to active the team
						resetNavigation('TeamList');
						return;
					}
				}

				// team has a active subscription
				resetNavigation('Home');
			}
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
	}, [email, password, reset, resetNavigation, teamContext]);

	useEffect(() => {
		try {
			const user = auth().currentUser;

			BootSplash.hide({ fade: true });

			if (user) {
				console.log("User's already logged in");
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

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
				<Form
					email={email}
					password={password}
					isLoging={isLoging}
					setEmail={setEmail}
					setPassword={setPassword}
					handleLogin={handleLogin}
				/>
			</Content>

			<Footer />
		</Container>
	);
};

export default Login;
