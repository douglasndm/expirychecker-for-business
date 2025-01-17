import React, { useCallback, useEffect, useState } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AppIntroSlider from 'react-native-app-intro-slider';

import strings from '@teams/Locales';

import Loading from '@components/Loading';

import { getHowManyTimesAppWasOpen } from '@teams/Functions/Settings';

import { IntroTitle, IntroImage, IntroText } from './styles';

interface ISlide {
	key: string;
	title: string;
	text: string;
	image: ImageSourcePropType;
	backgroundColor: string;
}

const slides: ISlide[] = [
	{
		key: '1',
		title: strings.View_Intro_Slide1_Title,
		text: strings.View_Intro_Slide1_Description,
		image: require('@teams/Assets/stopwatch.png'),
		backgroundColor: '#5856d6',
	},
	{
		key: '2',
		title: strings.View_Intro_Slide2_Title,
		text: strings.View_Intro_Slide2_Description,
		image: require('@teams/Assets/project-manager.png'),
		backgroundColor: '#5856d6',
	},
	{
		key: '3',
		title: strings.View_Intro_Slide3_Title,
		text: strings.View_Intro_Slide3_Description,
		image: require('@teams/Assets/Team.png'),
		backgroundColor: '#5856d6',
	},
	{
		key: '4',
		title: strings.View_Intro_Slide4_Title,
		text: strings.View_Intro_Slide4_Description,
		image: require('@assets/Images/Logo.png'),
		backgroundColor: '#5856d6',
	},
];

const Intro: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [showIntro, setShowIntro] = useState(false);

	const handleFirstRun = useCallback(async () => {
		const runTimes = await getHowManyTimesAppWasOpen();

		if (runTimes) {
			if (runTimes > 1) {
				navigate('Login');
				return;
			}
			await BootSplash.hide({ fade: true });
		}
		setShowIntro(true);
	}, [navigate]);

	useEffect(() => {
		handleFirstRun();
	}, []);

	const handleNavigateLogin = useCallback(() => {
		navigate('Login');
	}, [navigate]);

	interface renderItemProps {
		item: ISlide;
	}
	const renderItem = ({ item }: renderItemProps) => {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: item.backgroundColor,
					alignItems: 'center',
					justifyContent: 'space-around',
					paddingBottom: 100,
				}}
			>
				<IntroTitle>{item.title}</IntroTitle>
				<IntroImage source={item.image} />
				<IntroText>{item.text}</IntroText>
			</View>
		);
	};

	return (
		<>
			{showIntro ? (
				<AppIntroSlider
					data={slides}
					renderItem={renderItem}
					onDone={handleNavigateLogin}
					showSkipButton
					onSkip={handleNavigateLogin}
					skipLabel={strings.View_Intro_Button_Skip}
					nextLabel={strings.View_Intro_Button_Next}
					doneLabel={strings.View_Intro_Button_Done}
				/>
			) : (
				<Loading />
			)}
		</>
	);
};

export default Intro;
