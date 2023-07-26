import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { createTeam } from '@teams/Functions/Team';

import Header from '@components/Header';
import Button from '@components/Button';

import {
	Container,
	Content,
	InputTextContainer,
	InputText,
	InputTextTip,
} from './styles';

const Add: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isMounted, setIsMounted] = useState(true);

	const [name, setName] = useState<string>('');
	const [nameFieldError, setNameFieldError] = useState<boolean>(false);

	const [isCreating, setIsCreating] = useState<boolean>(false);

	const handleCreate = useCallback(async () => {
		if (!isMounted) return;
		try {
			setIsCreating(true);

			if (name.trim() === '') {
				setNameFieldError(true);
				return;
			}

			await createTeam({
				name,
			});

			showMessage({
				message: strings.View_CreateTeam_Message_SuccessCreated,
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
			setIsCreating(false);
		}
	}, [isMounted, name, reset]);

	useEffect(() => {
		return () => {
			setIsMounted(false);
		};
	}, []);

	return (
		<Container>
			<Header title={strings.View_CreateTeam_PageTitle} noDrawer />

			<Content>
				<InputTextContainer hasError={nameFieldError}>
					<InputText
						placeholder={
							strings.View_CreateTeam_InputText_Name_Placeholder
						}
						value={name}
						onChangeText={(value: string) => {
							setName(value);
							setNameFieldError(false);
						}}
					/>
				</InputTextContainer>

				{nameFieldError && (
					<InputTextTip>
						{strings.View_CreateTeam_InputText_Name_Erro_EmptyText}
					</InputTextTip>
				)}

				<Button
					text={strings.View_CreateTeam_Button_CreateTeam}
					isLoading={isCreating}
					onPress={handleCreate}
				/>
			</Content>
		</Container>
	);
};

export default Add;
