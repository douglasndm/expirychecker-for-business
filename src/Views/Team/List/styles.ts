import styled from 'styled-components/native';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.View`
	padding: 10px;
	flex: 1;
`;

export const EmptyText = styled.Text`
	font-family: 'Open Sans';
	font-size: 14px;
	color: ${props => props.theme.colors.text};
`;

export const ListTeamsTitle = styled.Text`
	margin: 10px 15px;
	color: ${props => props.theme.colors.text};
	font-size: 20px;
	font-family: 'Open Sans';
`;

export const Footer = styled.View``;
