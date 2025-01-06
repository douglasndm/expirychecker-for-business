import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@teams/Locales';

import Input from '@components/InputText';
import Button from '@components/Button';

import {
	FormContainer,
	FormTitle,
	LoginForm,
	ForgotPasswordText,
} from './styles';

interface Props {
	email: string;
	password: string;
	isLoging: boolean;
	setEmail: (value: string) => void;
	setPassword: (value: string) => void;
	handleLogin: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const handleNavigateToForgotPass = useCallback(() => {
		navigate('ForgotPassword');
	}, [navigate]);

	return (
		<FormContainer>
			<FormTitle>{strings.View_Login_FormLogin_Title}</FormTitle>
			<LoginForm>
				<Input
					value={props.email}
					onChangeText={props.setEmail}
					placeholder={strings.View_Login_InputText_Email_Placeholder}
					autoCorrect={false}
					autoCapitalize="none"
					keyboardType="email-address"
					contentStyle={{ marginBottom: 10 }}
				/>

				<Input
					value={props.password}
					onChangeText={props.setPassword}
					placeholder={
						strings.View_Login_InputText_Password_Placeholder
					}
					autoCorrect={false}
					autoCapitalize="none"
					isPassword
				/>

				<ForgotPasswordText onPress={handleNavigateToForgotPass}>
					{strings.View_Login_Label_ForgotPassword}
				</ForgotPasswordText>
			</LoginForm>

			<Button
				title={strings.View_Login_Button_SignIn}
				onPress={props.handleLogin}
				isLoading={props.isLoging}
			/>
		</FormContainer>
	);
};

export default Form;
