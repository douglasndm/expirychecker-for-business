import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import { Platform, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DefaultTheme } from 'styled-components/native';

import strings from '@teams/Locales';

import PreferencesContext from '@teams/Contexts/PreferencesContext';
import { useTeam } from '@teams/Contexts/TeamContext';

import Header from '@components/Header';

import DaysNext from '@views/Settings/Components/DaysNext';
import Appearance from '@views/Settings/Components/Appearance';

import { setAutoComplete } from '@teams/Functions/Settings';

import {
	Container,
	Content,
	SettingsContent,
	Category,
	CategoryTitle,
	CategoryOptions,
	SettingDescription,
	Switch,
	SettingContainer,
} from '@views/Settings/styles';

import Notifications from './Components/Notifications';
import Account from './Components/Account';

import { ButtonCancel, ButtonCancelText } from './styles';

const Settings: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { preferences, setPreferences } = useContext(PreferencesContext);
	const teamContext = useTeam();

	const [autoCompleteState, setAutoCompleteState] = useState<boolean>(false);

	const setSettingDaysToBeNext = useCallback(
		async (days: number) => {
			setPreferences({
				...preferences,
				howManyDaysToBeNextToExpire: days,
			});
		},
		[setPreferences, preferences]
	);

	const loadData = useCallback(async () => {
		setAutoCompleteState(preferences.autoComplete);
	}, [preferences.autoComplete]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleUpdateAutoComplete = useCallback(async () => {
		const newValue = !autoCompleteState;
		setAutoCompleteState(newValue);

		await setAutoComplete(newValue);

		setPreferences({
			...preferences,
			autoComplete: newValue,
		});
	}, [autoCompleteState, preferences, setPreferences]);

	const previousDaysToBeNext = String(
		preferences.howManyDaysToBeNextToExpire
	);

	const cancelSubscriptionLink = useMemo(() => {
		return Platform.OS === 'ios'
			? 'https://apps.apple.com/account/subscriptions'
			: 'https://play.google.com/store/account/subscriptions?sku=expirybusiness_monthly_default_1person&package=dev.douglasndm.expirychecker.business';
	}, []);

	const handleNavigateCancel = useCallback(async () => {
		await Linking.openURL(cancelSubscriptionLink);

		reset({
			routes: [{ name: 'Home' }],
		});
	}, [cancelSubscriptionLink, reset]);

	const onThemeChoosen = useCallback(
		(theme: DefaultTheme) => {
			setPreferences({
				...preferences,
				appTheme: theme,
			});
		},
		[setPreferences, preferences]
	);

	return (
		<Container>
			<Header title={strings.View_Settings_PageTitle} noDrawer />
			<Content>
				<SettingsContent>
					<Category>
						<CategoryTitle>
							{strings.View_Settings_CategoryName_General}
						</CategoryTitle>

						<CategoryOptions>
							<DaysNext
								defaultValue={previousDaysToBeNext}
								onUpdate={setSettingDaysToBeNext}
							/>

							<SettingContainer>
								<SettingDescription>
									Autocompletar automaticamente
								</SettingDescription>
								<Switch
									value={autoCompleteState}
									onValueChange={handleUpdateAutoComplete}
								/>
							</SettingContainer>

							<Notifications />
						</CategoryOptions>
					</Category>

					<Appearance teamsThemes onThemeChoosen={onThemeChoosen} />

					<Account />

					{teamContext.roleInTeam?.role.toLowerCase() ===
						'manager' && (
						<ButtonCancel onPress={handleNavigateCancel}>
							<ButtonCancelText>
								Cancelar assinatura
							</ButtonCancelText>
						</ButtonCancel>
					)}
				</SettingsContent>
			</Content>
		</Container>
	);
};

export default Settings;
