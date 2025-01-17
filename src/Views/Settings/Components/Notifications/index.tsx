import React, { useState, useCallback, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import {
	getNotificationsPreferences,
	updateNotificationsPreferences,
} from '~/Functions/Settings/Notifications';

import {
	LoadingIndicator,
	SettingNotificationContainer,
	SettingNotificationDescription,
	CheckBox,
} from './styles';

const Notifications: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [emailNotification, setEmailNotification] = useState<boolean>(false);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await getNotificationsPreferences();

			setEmailNotification(response.email_enabled);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateSettings = useCallback(async (value: boolean) => {
		try {
			setIsLoading(true);

			await updateNotificationsPreferences({
				email_enabled: value,
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const onEmailChange = useCallback(() => {
		updateSettings(!emailNotification);
		setEmailNotification(!emailNotification);
	}, [emailNotification, updateSettings]);

	return (
		<SettingNotificationContainer>
			<SettingNotificationDescription>
				{strings.View_Settings_Component_MailNotification_Title}
			</SettingNotificationDescription>

			{isLoading ? (
				<LoadingIndicator />
			) : (
				<CheckBox
					isChecked={emailNotification}
					onPress={onEmailChange}
					bounceFriction={10}
					text={
						strings.View_Settings_Component_MailNotification_Description
					}
				/>
			)}
		</SettingNotificationContainer>
	);
};

export default Notifications;
