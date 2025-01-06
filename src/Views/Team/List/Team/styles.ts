import styled, { css } from 'styled-components/native';
import { darken } from 'polished';

interface TeamItemContainerProps {
	isPending?: boolean;
}

export const TeamItemContainer = styled.TouchableOpacity<TeamItemContainerProps>`
	background-color: ${props => props.theme.colors.inputBackground};
	padding: 20px;
	margin-bottom: 10px;
	border-radius: 12px;

	flex-direction: row;
	justify-content: space-between;

	${props =>
		props.isPending &&
		css`
			background-color: ${darken(
				0.13,
				props.theme.colors.inputBackground
			)};
		`}
`;

export const TeamItemTitle = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-size: 18px;
`;

export const TeamItemRole = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-size: 15px;
`;
