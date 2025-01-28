import styled, { css } from 'styled-components/native';
import { darken } from 'polished';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

interface TeamItemContainerProps {
	isPending?: boolean;
}

export const TeamItemContainer = styled.TouchableOpacity<TeamItemContainerProps>`
	background-color: ${props => props.theme.colors.inputBackground};
	padding: 20px 14px;
	margin-bottom: 10px;
	border-radius: 12px;

	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	${props =>
		props.isPending &&
		css`
			background-color: ${darken(
				0.12,
				props.theme.colors.inputBackground
			)};
		`}
`;

export const UserInfoContainer = styled.View`
	flex: 1;
	justify-content: center;
`;

export const TeamItemTitle = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-size: 18px;
	font-weight: bold;
`;

export const UserEmail = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-size: 16px;
	flex: 1;
`;

export const TeamItemRole = styled.Text`
	color: ${props => props.theme.colors.productCardText};
	font-size: 14px;
`;

export const AddCategoryContent = styled.View`
	flex-direction: column;
`;

export const InputContainer = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	margin: 10px 5px;
`;

interface InputTextContainerProps {
	hasError?: boolean;
}

export const InputTextContainer = styled.View<InputTextContainerProps>`
	flex: 1;
	margin-right: 7px;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 12px;
	background-color: ${({ theme }) => theme.colors.inputBackground};

	${props =>
		props.hasError &&
		css`
			border: 2px solid red;
		`}
`;

export const AddCategoryButtonContainer = styled.TouchableOpacity`
	background-color: ${props => props.theme.colors.accent};
	padding: 13px 15px;
	border-radius: 12px;
`;
export const ListTitle = styled.Text`
	margin: 10px 15px 10px;
	font-size: 20px;
	color: ${props => props.theme.colors.accent};
`;

export const ListCategories = styled.FlatList`
	margin: 0 10px;
`;

export const LoadingIcon = styled.ActivityIndicator.attrs(() => ({
	size: 22,
	color: '#fff',
}))``;

export const InputTextTip = styled.Text`
	color: red;
	margin: -5px 10px 5px;
`;
