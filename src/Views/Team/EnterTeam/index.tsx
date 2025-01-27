import React, { useCallback, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { setCurrentTeam } from '@teams/Utils/Team/CurrentTeam';
import { setTeamPreferences } from '@teams/Utils/Team/Preferences';

import { enterTeamCode } from '@teams/Functions/Team/Users';
import { getTeamPreferences } from '@teams/Functions/Team/Preferences';

import Header from '@components/Header';
import Button from '@components/Button';

import {
	Container,
	InviteText,
	CodeContaider,
	InputContainer,
	InputTextContainer,
	InputText,
	InputTextTip,
} from './styles';

const EnterTeam: React.FC = () => {
	const teamContext = useTeam();

	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();
	const { params } = useRoute<RouteProp<RoutesParams, 'EnterTeam'>>();

	const userRole = useMemo(() => {
		return params.userRole || null;
	}, [params]);

	const [userCode, setUserCode] = useState<string>('');
	const [isAddingCode, setIsAddingCode] = useState<boolean>(false);
	const [inputHasError, setInputHasError] = useState<boolean>(false);
	const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

	const handleOnCodeChange = useCallback((value: string) => {
		setUserCode(value);
	}, []);

	const handleSubmitCode = useCallback(async () => {
		try {
			setIsAddingCode(true);

			if (userCode.trim() === '') {
				setInputHasError(true);
				setInputErrorMessage(strings.View_EnterTeam_Error_InvalidCode);
				return;
			}

			await enterTeamCode({
				code: userCode,
				team_id: userRole.team.id,
			});

			// View_TeamList_InvalidTeamCode
			showMessage({
				message: strings.View_TeamList_SuccessCode,
				type: 'info',
			});

			const teamPreferences = await getTeamPreferences({
				team_id: userRole.team.id,
			});

			await setCurrentTeam(userRole.team);
			await setTeamPreferences(teamPreferences);

			if (teamContext.reload) {
				teamContext.reload();
			}

			reset({
				routes: [{ name: 'Home' }],
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsAddingCode(false);
		}
	}, [reset, teamContext, userCode, userRole]);

	return (
		<Container>
			<Header title={strings.View_EnterTeam_Title} noDrawer />

			{!!userRole.team.name && (
				<InviteText>
					{strings.View_EnterTeam_Description.replace(
						'{TEAM_NAME}',
						userRole.team.name
					)}
				</InviteText>
			)}

			<CodeContaider>
				<InputContainer>
					<InputTextContainer hasError={inputHasError}>
						<InputText
							value={userCode}
							onChangeText={handleOnCodeChange}
							placeholder={
								strings.View_EnterTeam_InputText_EnterCode_Placeholder
							}
							autoCapitalize="none"
							autoCorrect={false}
						/>
					</InputTextContainer>
					{!!inputErrorMessage && (
						<InputTextTip>{inputErrorMessage}</InputTextTip>
					)}
				</InputContainer>
			</CodeContaider>
			<Button
				title={strings.View_EnterTeam_Button_Enter}
				onPress={handleSubmitCode}
				isLoading={isAddingCode}
			/>
		</Container>
	);
};

export default EnterTeam;
