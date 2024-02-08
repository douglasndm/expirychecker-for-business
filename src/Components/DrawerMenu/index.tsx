import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import {
	Container,
	MainMenuContainer,
	MenuItemContainer,
	MenuContent,
	MenuItemText,
	Icons,
	DrawerSection,
	PageContainer,
} from '@components/Menu/Drawer/styles';

import UserInfo from './UserInfo';

const DrawerMenu: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const navigateToHome = useCallback(() => {
		navigate('Home', {});
	}, [navigate]);

	const navigateToAddProduct = useCallback(() => {
		navigate('AddProduct', {});
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

	const handleNavigateToAbout = useCallback(() => {
		navigate('About');
	}, [navigate]);

	const handleNavigateToTest = useCallback(() => {
		navigate('Test');
	}, [navigate]);

	return (
		<PageContainer>
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

					{!!teamContext.id && (
						<MenuItemContainer onPress={handleNavigateToTeam}>
							<MenuContent>
								<Icons name="briefcase-outline" />
								<MenuItemText>
									{strings.Menu_Button_GoToYourTeam}
								</MenuItemText>
							</MenuContent>
						</MenuItemContainer>
					)}

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
		</PageContainer>
	);
};

export default DrawerMenu;
