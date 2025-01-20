import React, { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import { clearSelectedteam } from '@teams/Functions/Team/SelectedTeam';
import { logoutFirebase } from '@teams/Utils/Auth/Firebase';

import Loading from '@components/Loading';

import { useTeam } from '@teams/Contexts/TeamContext';

const Logout: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();
	const teamContext = useTeam();

	const handleLogout = useCallback(async () => {
		try {
			await logoutFirebase();
			await clearSelectedteam();

			if (teamContext.reload) {
				teamContext.reload();
			}

			reset({
				routes: [
					{
						name: 'Login',
					},
				],
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [reset, teamContext]);

	useEffect(() => {
		handleLogout();
	}, [handleLogout]);
	return <Loading />;
};

export default Logout;
