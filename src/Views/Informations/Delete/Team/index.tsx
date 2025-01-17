import React, { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { isSubscriptionActive } from '@teams/Functions/Team/Subscriptions';
import { deleteTeam } from '@teams/Functions/Team';

import Header from '@components/Header';
import Button from '@components/Button';
import PaddingComponent from '@components/PaddingComponent';

import {
	Container,
	Content,
	ActionTitle,
	ActionDescription,
	ActionConsequence,
	CheckBoxContainer,
	CheckBox,
	BlockContainer,
	BlockTitle,
	BlockDescription,
	Link,
} from './styles';

const Team: React.FC = () => {
	const { navigate, reset } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const [activesSubs, setActivesSubs] = useState<boolean>(false);

	const [agreeConsequence, setAgreeConsequence] = useState<boolean>(false);
	const [enableExcel, setEnableExcel] = useState<boolean>(false);
	const [allSubsCanceled, setAllSubsCanceled] = useState<boolean>(false);

	const [isCheckingSub, setIsCheckingSub] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	const loadSubscriptions = useCallback(async () => {
		const isActive = await isSubscriptionActive();

		setActivesSubs(isActive);
	}, []);

	const handleChangeAgree = useCallback(() => {
		setEnableExcel(!enableExcel);
	}, [enableExcel]);

	const handleChangeSubs = useCallback(() => {
		setAgreeConsequence(!agreeConsequence);
	}, [agreeConsequence]);

	const handleExcelExport = useCallback(() => {
		navigate('Export');
	}, [navigate]);

	const handleCheckSubscription = useCallback(async () => {
		try {
			setIsCheckingSub(true);

			await loadSubscriptions();

			setAllSubsCanceled(true);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsCheckingSub(false);
		}
	}, [loadSubscriptions]);

	const handleDeleteTeam = useCallback(async () => {
		try {
			setIsDeleting(true);

			await deleteTeam();

			showMessage({
				message: 'O time foi apagado',
				type: 'info',
			});

			reset({
				routes: [{ name: 'TeamList' }],
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsDeleting(false);
		}
	}, [reset]);

	const handleGoToStore = useCallback(async () => {
		if (activesSubs) {
			const storeLink =
				Platform.OS === 'ios'
					? 'https://apps.apple.com/account/subscriptions'
					: 'https://play.google.com/store/account/subscriptions';

			await Linking.openURL(storeLink);
		}
	}, [activesSubs]);

	useEffect(() => {
		loadSubscriptions();
	}, []);

	return (
		<Container>
			<Header
				title={strings.View_Information_Team_Delete_PageTitle}
				noDrawer
			/>

			<Content>
				<ActionTitle>
					{strings.View_Information_Team_Delete_Atention}
				</ActionTitle>

				<ActionDescription>
					{strings.View_Information_Team_Delete_Description}
				</ActionDescription>
				<ActionConsequence>
					{strings.View_Information_Team_Delete_Consequence}
				</ActionConsequence>

				<CheckBoxContainer>
					<CheckBox
						isChecked={enableExcel}
						onPress={handleChangeAgree}
						bounceFriction={10}
						text={
							strings.View_Information_Team_Delete_CheckBox_Confirm
						}
					/>
				</CheckBoxContainer>

				<BlockContainer isEnable={enableExcel}>
					<BlockTitle>
						{strings.View_Information_Team_Delete_Export_Title}
					</BlockTitle>
					<BlockDescription>
						{
							strings.View_Information_Team_Delete_Export_Description
						}
					</BlockDescription>

					<Button
						title={
							strings.View_Information_Team_Delete_Export_Button
						}
						onPress={handleExcelExport}
					/>

					<CheckBoxContainer>
						<CheckBox
							isChecked={agreeConsequence}
							onPress={handleChangeSubs}
							bounceFriction={10}
							style={{ marginTop: -15 }}
							text={
								strings.View_Information_Team_Delete_Export_CheckBox_Confirm
							}
						/>
					</CheckBoxContainer>
				</BlockContainer>

				<BlockContainer isEnable={agreeConsequence && enableExcel}>
					<BlockTitle>
						{
							strings.View_Information_Team_Delete_Subscription_title
						}
					</BlockTitle>
					<BlockDescription>
						{
							strings.View_Information_Team_Delete_Subscription_description
						}
					</BlockDescription>

					{activesSubs && (
						<Link onPress={handleGoToStore}>
							{
								strings.View_Information_Team_Delete_Subscription_Button
							}
						</Link>
					)}

					<Button
						title={
							strings.View_Information_Team_Delete_Subscription_Button_Check_Subscription
						}
						isLoading={isCheckingSub}
						onPress={handleCheckSubscription}
					/>
				</BlockContainer>

				<BlockContainer
					isEnable={
						allSubsCanceled &&
						agreeConsequence &&
						enableExcel &&
						!activesSubs
					}
				>
					<BlockTitle>
						{strings.View_Information_Team_Delete_Finish_Title}
					</BlockTitle>
					<BlockDescription>
						{
							strings.View_Information_Team_Delete_Finish_Description
						}
					</BlockDescription>

					<Button
						title="Apagar time"
						onPress={handleDeleteTeam}
						isLoading={isDeleting}
						contentStyle={{ backgroundColor: '#b00c17' }}
					/>
				</BlockContainer>

				<PaddingComponent />
			</Content>
		</Container>
	);
};

export default Team;
