import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import FlashMessage from 'react-native-flash-message';

import StatusBar from '@components/StatusBar';
import AskReview from '@components/AskReview';

import '@teams/Locales';

import '@services/Firebase/AppCheck';
import '@services/Firebase/RemoteConfig';

import '@teams/Services/Analytics';
import DeepLinking from '@teams/Services/DeepLinking';

import '@teams/Functions/Team/Subscriptions';
import '@teams/Functions/PushNotifications';
import { getAllUserPreferences } from '@teams/Functions/UserPreferences';

import Routes from '@teams/routes';

import PreferencesContext from '@teams/Contexts/PreferencesContext';
import DefaultPrefs from '@teams/Contexts/DefaultPreferences';
import { AuthProvider } from '@teams/Contexts/AuthContext';
import { TeamProvider } from '@teams/Contexts/TeamContext';

import { IUserPreferences } from './@types/userPreference';

const App: React.FC = () => {
	const [preferences, setPreferences] =
		useState<IUserPreferences>(DefaultPrefs);

	const loadInitialData = useCallback(async () => {
		const prefs = await getAllUserPreferences();
		setPreferences(prefs);
	}, []);

	useEffect(() => {
		loadInitialData();
	}, []);

	const prefes = useMemo(
		() => ({
			preferences,
			setPreferences,
		}),
		[preferences]
	);

	return (
		<NavigationContainer linking={DeepLinking}>
			<PreferencesContext.Provider value={prefes}>
				<ThemeProvider theme={preferences.appTheme}>
					<PaperProvider>
						<AuthProvider>
							<TeamProvider>
								<StatusBar />
								<Routes />
								<AskReview />
							</TeamProvider>
						</AuthProvider>
						<FlashMessage duration={7000} statusBarHeight={50} />
					</PaperProvider>
				</ThemeProvider>
			</PreferencesContext.Provider>
		</NavigationContainer>
	);
};

export default App;
