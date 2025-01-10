import React, { useCallback } from 'react';
import { Linking, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'styled-components';

import strings from '@teams/Locales';
import sharedStrings from '@shared/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import WeightIcon from '@assets/Icons/shipment-weight-kg.png';
import WeightIconDark from '@assets/Icons/shipment-weight-kg-dark.png';
import LitersIcon from '@assets/Icons/water-glass-half-full.png';
import LitersIconDark from '@assets/Icons/water-glass-half-full-dark.png';

import {
	MainMenuContainer,
	MenuItemContainer,
	MenuContent,
	MenuItemText,
	Icons,
	DrawerSection,
} from '@components/Menu/Drawer/styles';
import { Container } from './styles';

import UserInfo from './UserInfo';

const DrawerMenu: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const theme = useTheme();

	const teamContext = useTeam();

	const navigateToHome = useCallback(() => {
		navigate('Home', {});
	}, [navigate]);

	const navigateToAddProduct = useCallback(() => {
		navigate('AddProduct', {});
	}, [navigate]);

	const navigateToSortedByWeight = useCallback(() => {
		navigate('ProductsSortedByWeight');
	}, [navigate]);

	const navigateToSortedByLiters = useCallback(() => {
		navigate('ProductsSortedByLiters');
	}, [navigate]);

	const navigateToCategories = useCallback(() => {
		navigate('ListCategory');
	}, [navigate]);

	const navigateToBrands = useCallback(() => {
		navigate('BrandList');
	}, [navigate]);

	const navigateToStores = useCallback(() => {
		navigate('StoreList');
	}, [navigate]);

	const navigateToExport = useCallback(() => {
		navigate('Export');
	}, [navigate]);

	const handleNavigateToTeam = useCallback(() => {
		navigate('ViewTeam');
	}, [navigate]);

	const handleNavigateToSettings = useCallback(() => {
		navigate('Settings');
	}, [navigate]);

	const handleNavigateToFaq = useCallback(async () => {
		await Linking.openURL(
			'https://controledevalidades.com/perguntas-frequentes'
		);
	}, []);

	const handleNavigateToAbout = useCallback(() => {
		navigate('About');
	}, [navigate]);

	const handleNavigateToTest = useCallback(() => {
		navigate('Test');
	}, [navigate]);

	return (
		<Container>
			<MainMenuContainer>
				<UserInfo />

				<DrawerSection>
					<MenuItemContainer onPress={navigateToHome}>
						<MenuContent>
							<Icons name="home-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToHome}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={navigateToAddProduct}>
						<MenuContent>
							<Icons name="add" />
							<MenuItemText>
								{strings.Menu_Button_GoToAddProduct}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={navigateToSortedByWeight}>
						<MenuContent>
							<Image
								source={
									!theme.isDark ? WeightIconDark : WeightIcon
								}
								style={{ width: 22, height: 22 }}
							/>
							<MenuItemText>
								{sharedStrings.Menu_Button_GoToSortedByWeight}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={navigateToSortedByLiters}>
						<MenuContent>
							<Image
								source={
									!theme.isDark ? LitersIconDark : LitersIcon
								}
								style={{ width: 22, height: 22 }}
							/>
							<MenuItemText>
								{sharedStrings.Menu_Button_GoToSortedByLiters}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={navigateToCategories}>
						<MenuContent>
							<Icons name="file-tray-full-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToCategories}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={navigateToBrands}>
						<MenuContent>
							<Icons name="ribbon-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToBrands}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={navigateToStores}>
						<MenuContent>
							<Icons name="list-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToStores}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={navigateToExport}>
						<MenuContent>
							<Icons name="download-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToExport}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>
				</DrawerSection>
			</MainMenuContainer>

			<DrawerSection>
				<MenuItemContainer onPress={handleNavigateToSettings}>
					<MenuContent>
						<Icons name="settings-outline" />
						<MenuItemText>
							{strings.Menu_Button_GoToSettings}
						</MenuItemText>
					</MenuContent>
				</MenuItemContainer>

				{!!teamContext.name && (
					<MenuItemContainer onPress={handleNavigateToTeam}>
						<MenuContent>
							<Icons name="briefcase-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToYourTeam}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>
				)}

				<MenuItemContainer onPress={handleNavigateToFaq}>
					<MenuContent>
						<Icons name="book-outline" />
						<MenuItemText>Perguntas Frequentes</MenuItemText>
					</MenuContent>
				</MenuItemContainer>

				<MenuItemContainer onPress={handleNavigateToAbout}>
					<MenuContent>
						<Icons name="help-circle-outline" />
						<MenuItemText>
							{strings.Menu_Button_GoToAbout}
						</MenuItemText>
					</MenuContent>
				</MenuItemContainer>

				{__DEV__ && (
					<MenuItemContainer onPress={handleNavigateToTest}>
						<MenuContent>
							<Icons name="bug-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToTest}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>
				)}
			</DrawerSection>
		</Container>
	);
};

export default DrawerMenu;
