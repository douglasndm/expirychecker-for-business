import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@shared/Locales';

import { recoveryPassword } from '@teams/Functions/Auth/Firebase/password';

import Header from '@components/Header';
import Input from '@components/InputText';
import Button from '@components/Button';

import { Container, Content } from '@views/Auth/ForgotPassword/styles';

const ForgotPassword: React.FC = () => {
	const { goBack } = useNavigation();

	const [isRecovering, setIsRecovering] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');

	const handleEmailChange = useCallback(
		(value: string) => setEmail(value.trim()),
		[]
	);

	const handleRecoveryPassword = useCallback(async () => {
		const schema = Yup.object().shape({
			email: Yup.string().required().email(),
		});

		try {
			setIsRecovering(true);
			await schema.validate({ email });

			await recoveryPassword({ email });

			showMessage({
				message: strings.View_RecoveryPassword_Alert_Success,
				type: 'info',
			});

			goBack();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsRecovering(false);
		}
	}, [email, goBack]);
	return (
		<Container>
			<Header title={strings.View_RecoveryPassword_PageTitle} noDrawer />

			<Content>
				<Input
					placeholder={
						strings.View_RecoveryPassword_InputText_Email_Placeholder
					}
					autoCorrect={false}
					autoCapitalize="none"
					value={email}
					onChangeText={handleEmailChange}
				/>
				<Button
					title={strings.View_RecoveryPassword_Button_Recovery}
					onPress={handleRecoveryPassword}
					isLoading={isRecovering}
				/>
			</Content>
		</Container>
	);
};

export default ForgotPassword;
