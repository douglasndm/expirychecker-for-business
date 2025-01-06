import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import appCheck from '@react-native-firebase/app-check';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '@components/Button';

import { deleteSubscription } from '@teams/Functions/Team/Subscriptions/Delete';
import { getSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

import { Container, Category } from '../Settings/styles';

const Test: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const handleToken = useCallback(async () => {
		const token = await auth().currentUser?.getIdTokenResult();

		console.log(token?.token);
	}, []);

	const deleteSub = useCallback(async () => {
		const team = await getSelectedTeam();

		if (!team) return;
		await deleteSubscription(team.userRole.team.id);
	}, []);

	const handleNavigate = useCallback(() => {
		navigate('NoInternet');
	}, [navigate]);

	const testAppCheck = useCallback(async () => {
		try {
			const { token } = await appCheck().getToken(true);

			if (token.length > 0) {
				console.log('AppCheck verification passed');
			}
		} catch (error) {
			console.log(error);
			console.log('AppCheck verification failed');
		}
	}, []);

	return (
		<Container>
			<ScrollView>
				<Category>
					<Button title="Log user token" onPress={handleToken} />
					<Button title="Test app check" onPress={testAppCheck} />

					<Button title="Delete subscription" onPress={deleteSub} />

					<Button
						title="Navigate to noInternet"
						onPress={handleNavigate}
					/>
				</Category>
			</ScrollView>
		</Container>
	);
};

export default Test;
