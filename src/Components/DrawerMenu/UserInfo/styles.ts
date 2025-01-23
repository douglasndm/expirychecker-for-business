import styled from 'styled-components/native';
import { Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.Pressable`
	flex-direction: row;
	padding: 10px;
`;

export const TextContainer = styled.View`
	justify-content: center;
`;

export const UserName = styled.Text`
	margin-left: 10px;
	font-size: 16px;
	color: ${props => props.theme.colors.text};
`;

export const UserEmail = styled.Text`
	margin: 0 10px;
	font-size: 11px;
	color: ${props => props.theme.colors.text};
`;

export const UserInfo = styled.Text`
	margin-left: 10px;
	font-size: 12px;
	color: ${props => props.theme.colors.text};
`;

export const UserPhoto = styled(Image)`
	width: 54px;
	height: 54px;
	border-radius: 26px;
`;

export const DefaultUserPhoto = styled(Ionicons).attrs(props => ({
	size: 42,
	color: props.theme.colors.text,
}))``;
