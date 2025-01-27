import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { setCurrentTeam } from '@teams/Utils/Team/CurrentTeam';

import { editTeam } from '@teams/Functions/Team';
import { getSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

import Header from '@components/Header';
import Input from '@components/InputText';
import Loading from '@components/Loading';

import { Container, Content, InputGroup, InputTextTip } from './styles';

const Edit: React.FC = () => {
	const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [name, setName] = useState<string>('');
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [nameError, setNameError] = useState<string>('');

	const handleUpdate = useCallback(async () => {
		if (!teamContext) {
			return;
		}
		try {
			setIsUpdating(true);

			if (name.trim() === '') {
				setNameError(strings.View_TeamEdit_Alert_Error_EmptyTeamName);
				return;
			}

			await editTeam({ name });

			const settedTeam = await getSelectedTeam();

			if (settedTeam) {
				await setCurrentTeam({
					id: settedTeam.userRole.team.id,
					name: name.trim(),
				});

				if (teamContext.reload) {
					teamContext.reload();
				}
			}

			showMessage({
				message: strings.View_TeamEdit_Alert_Success_TeamUpdated,
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsUpdating(false);
		}
	}, [name, pop, teamContext]);

	const handleNameChange = useCallback((value: string) => {
		setName(value);
	}, []);

	useEffect(() => {
		if (teamContext.name) {
			setName(teamContext.name);
		}
	}, [teamContext.name]);

	return isUpdating ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_TeamEdit_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'content-save-outline',
						onPress: handleUpdate,
					},
				]}
			/>

			<Content>
				<InputGroup>
					<Input
						value={name}
						onChangeText={handleNameChange}
						placeholder={
							strings.View_TeamEdit_Input_Placeholder_TeamName
						}
						hasError={!!nameError}
						contentStyle={{ flex: 1 }}
					/>
				</InputGroup>
				{!!nameError && <InputTextTip>{nameError}</InputTextTip>}
			</Content>
		</Container>
	);
};

export default Edit;
