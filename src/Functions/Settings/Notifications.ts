import api from '@teams/Services/API/Config';

interface INotificationsPreferences {
	email_enabled: boolean;
}

export async function getNotificationsPreferences(): Promise<INotificationsPreferences> {
	const response = await api.get<INotificationsPreferences>('/notifications');

	return response.data;
}

export async function updateNotificationsPreferences({
	email_enabled,
}: INotificationsPreferences): Promise<void> {
	await api.put<INotificationsPreferences>('/notifications', {
		allowEmailNotification: email_enabled,
	});
}
