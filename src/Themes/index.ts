import { Appearance } from 'react-native';
import { DefaultTheme } from 'styled-components';

import Light from './Light';
import Dark from './Dark';
import UltraViolet from './UltraViolet';
import DarkGreen from './DarkGreen';
import HappyPink from './HappyPink';
import OceanBlue from './OceanBlue';
import Relax from './Relax';

import { getAppTheme } from '../Functions/Settings';

export default {
    Light,
    Dark,
    UltraViolet,
    DarkGreen,
    HappyPink,
    OceanBlue,
    Relax,
};

export const getActualAppTheme = async (): Promise<DefaultTheme> => {
    const theme = await getAppTheme();

    if (theme === 'light') {
        return Light;
    }
    if (theme === 'dark') {
        return Dark;
    }
    if (theme === 'ultraviolet') {
        return UltraViolet;
    }
    if (theme === 'darkgreen') {
        return DarkGreen;
    }
    if (theme === 'happypink') {
        return HappyPink;
    }
    if (theme === 'oceanblue') {
        return OceanBlue;
    }
    if (theme === 'relax') {
        return Relax;
    }
    if (theme === 'system') {
        const systemTheme = Appearance.getColorScheme();

        if (systemTheme === 'dark') {
            return Dark;
        }
        return Light;
    }
    return Light;
};
