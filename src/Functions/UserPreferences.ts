import { IUserPreferences } from '../@types/userPreference';
import { getThemeByName } from '../Themes';

import {
    getEnableNotifications,
    getNotificationCadency,
    getHowManyDaysToBeNextExp,
} from './Settings';
import { getAppTheme } from './Themes';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
    try {
        const settingDay = await getHowManyDaysToBeNextExp();
        const settingTheme = await getAppTheme();
        const settingNotification = await getEnableNotifications();
        const settingNotificationCadency = await getNotificationCadency();

        const settings: IUserPreferences = {
            howManyDaysToBeNextToExpire: settingDay,
            appTheme: getThemeByName(settingTheme),
            enableNotifications: settingNotification,
            notificationCadency: settingNotificationCadency,
        };

        return settings;
    } catch (err) {
        throw new Error(err);
    }
}
