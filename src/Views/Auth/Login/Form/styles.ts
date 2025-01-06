import styled from 'styled-components/native';

export const FormContainer = styled.View`
	align-items: stretch;
	margin-top: 14px;
	padding: 0 15px;
`;

export const FormTitle = styled.Text`
	color: ${props => props.theme.colors.text};
	font-family: 'Open Sans';
	margin-bottom: 15px;
	font-size: 26px;
	text-align: center;
`;

export const LoginForm = styled.View`
	flex-direction: column;
	flex: 1;
`;

export const ForgotPasswordText = styled.Text`
	font-family: 'Open Sans';
	font-size: 15px;
	margin: 5px 10px 0;
	color: ${props => props.theme.colors.subText};
`;
