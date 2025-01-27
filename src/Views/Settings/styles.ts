import styled from 'styled-components/native';

interface Request {
	notPremium?: boolean;
}

export const Container = styled.SafeAreaView`
	flex: 1;
	background: ${props => props.theme.colors.background};
`;

export const Category = styled.View`
	margin-top: 20px;
	padding: 15px 15px 25px;
	background-color: ${props => props.theme.colors.productBackground};
	border-radius: 12px;
`;

export const CategoryTitle = styled.Text`
	font-size: 21px;
	color: ${props => props.theme.colors.productCardText};
`;

export const CategoryOptions = styled.View<Request>`
	margin-top: 20px;
	opacity: ${props => (props.notPremium ? 0.2 : 1)};
`;

export const SettingDescription = styled.Text`
	font-size: 14px;
	color: ${props => props.theme.colors.inputText};
`;

export const ButtonCancel = styled.TouchableOpacity`
	margin-top: 15px;
	background-color: #999;
	padding: 13px;
	border-radius: 12px;
	align-self: center;
`;

export const ButtonCancelText = styled.Text`
	font-size: 13px;
	color: #fff;
`;
