import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@teams/Locales';

import { AboutContainer, CreateAccountText, Text, Link } from './styles';

const Footer: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const handleNavigateToCreateAcc = useCallback(() => {
		navigate('CreateAccount');
	}, [navigate]);

	const navigateToTerms = useCallback(async () => {
		await Linking.openURL('https://douglasndm.dev/terms');
	}, []);

	const navigateToPrivacy = useCallback(async () => {
		await Linking.openURL(
			'https://controledevalidades.com/politica-de-privacidade/'
		);
	}, []);

	return (
		<AboutContainer>
			<CreateAccountText onPress={handleNavigateToCreateAcc}>
				{strings.View_Login_Label_CreateAccount}
			</CreateAccountText>

			<Text>
				{strings.BeforeTermsAndPrivacy}
				<Link onPress={navigateToTerms}>{strings.Terms}</Link>
				{strings.BetweenTermsAndPrivacy}
				<Link onPress={navigateToPrivacy}>{strings.PrivacyPolicy}</Link>
				.
			</Text>
		</AboutContainer>
	);
};

export default Footer;
