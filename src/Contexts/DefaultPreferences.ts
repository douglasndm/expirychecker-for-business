import { NotificationCadency } from '~/Functions/Settings';

import { IUserPreferences } from '~/@types/userPreference';

import Themes from '@themes/index';

const obj: IUserPreferences = {
    howManyDaysToBeNextToExpire: 30,
    appTheme: Themes.Light,
    autoComplete: false,
    enableNotifications: true,
    selectedTeam: null,
};

export default obj;
