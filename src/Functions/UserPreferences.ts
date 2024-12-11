import { getThemeByName } from '@shared/Themes';
import { getAppTheme } from '@utils/Themes';

import { IUserPreferences } from '@teams/@types/userPreference';

import { getHowManyDaysToBeNextExp } from '@utils/Settings/DaysNext';
import { getEnableNotifications, getAutoComplete } from './Settings';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
	const settingDay = await getHowManyDaysToBeNextExp();
	const settingTheme = await getAppTheme(true);
	const settingAutoComplete = await getAutoComplete();
	const settingNotification = await getEnableNotifications();

	const settings: IUserPreferences = {
		howManyDaysToBeNextToExpire: settingDay,
		autoComplete: settingAutoComplete,
		appTheme: getThemeByName(settingTheme, true),
		enableNotifications: settingNotification,
	};

	return settings;
}
