import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
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

import BugSnagContainer from '@shared/BugsnagContainer';

import Routes from '@teams/routes';

import PreferencesContext from '@teams/Contexts/PreferencesContext';
import DefaultPrefs from '@teams/Contexts/DefaultPreferences';
import { AuthProvider } from '@teams/Contexts/AuthContext';
import { TeamProvider } from '@teams/Contexts/TeamContext';

const App: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [preferences, setPreferences] =
		useState<IUserPreferences>(DefaultPrefs);

	const loadInitialData = useCallback(async () => {
		const prefs = await getAllUserPreferences();

		setPreferences(prefs);

		setIsLoading(false);
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

	return isLoading ? (
		<ActivityIndicator size="large" />
	) : (
		<BugSnagContainer DeepLinking={DeepLinking}>
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
		</BugSnagContainer>
	);
};

export default App;
