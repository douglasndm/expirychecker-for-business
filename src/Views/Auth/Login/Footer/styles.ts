import styled from 'styled-components/native';

export const Text = styled.Text`
	color: ${props => props.theme.colors.text};
	text-align: center;
`;

export const CreateAccountText = styled.Text`
	margin-bottom: 15px;
	color: ${props => props.theme.colors.textAccent};
	font-family: 'Open Sans';
	font-weight: bold;
	font-size: 15px;
`;

export const AboutContainer = styled.View`
	margin: 30px 15px;
	align-items: center;
`;

export const Link = styled.Text`
	color: ${props => props.theme.colors.accent};
	font-size: 14px;
`;
