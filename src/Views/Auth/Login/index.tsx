import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BootSplash from 'react-native-bootsplash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { captureException } from '@services/ExceptionsHandler';

import {
	IOrganizedInfoResponse,
	organizedInfo,
} from '@teams/Utils/User/Login/organizedInfo';

import { login } from '@teams/Functions/Auth';
import { getTeamPreferences } from '@teams/Functions/Team/Preferences';
import { setSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

import { setCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import Container from '@components/ScrollView';

import Form from './Form';
import Footer from './Footer';

import { Content, LogoContainer, Logo, LogoTitle } from './styles';

const Login: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

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

	const handleNavigationAfterLogin = useCallback(async () => {
		const setting = await AsyncStorage.getItem('userInfo');
		const response = JSON.parse(String(setting)) as IOrganizedInfoResponse;

		// if user has no team
		if (!response) {
			resetNavigation('TeamList');
			return;
		} else if (response.role) {
			const { name, status, code, team } = response.role;

			// if user has a team but it didn't enter the code yet
			if (name !== 'manager' && status !== 'completed') {
				reset({
					routes: [
						{
							name: 'TeamList',
						},
						{
							name: 'EnterTeam',
							params: {
								userRole: {
									team: response.role.team,
									code: response.role.code,
								},
							},
						},
					],
				});
				return;
			}

			// Now we are setting the current team
			const teamPreferences = await getTeamPreferences({
				team_id: response.role.team.id,
			});

			await setSelectedTeam({
				userRole: {
					name,
					status,
					code,
					team,
				},
				teamPreferences,
			});

			await setCurrentTeam({
				id: team.id,
				name: team.name,
			});

			if (teamContext.reload) {
				teamContext.reload();
			}

			// Check subscription and if user is manager
			if (!response.teamSubscription) {
				if (response.role.name === 'manager') {
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
		} else {
			resetNavigation('TeamList');
			return;
		}
	}, [reset, resetNavigation, teamContext]);

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

			await AsyncStorage.setItem('userInfo', JSON.stringify(response));

			await handleNavigationAfterLogin();
		} catch (err) {
			if (err instanceof Error) {
				captureException(err, { stack: err.stack });
			}
		} finally {
			setIsLoging(false);
		}
	}, [email, handleNavigationAfterLogin, password]);

	useEffect(() => {
		try {
			setIsLoading(true);
			setIsLoging(true);
			const user = auth().currentUser;

			if (user) {
				handleNavigationAfterLogin();
			}
		} finally {
			setIsLoading(false);
			setIsLoging(false);
			BootSplash.hide({ fade: true });
		}
	}, []);

	return (
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
					isLoging={isLoading || isLoging}
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
