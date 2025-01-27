import styled from 'styled-components/native';
import RNSlider from '@react-native-community/slider';

export const Container = styled.View`
	background-color: ${({ theme }) => theme.colors.background};
	flex: 1;
`;

export const Content = styled.View`
	margin: 2% 5%;
`;

export const BatchName = styled.Text`
	font-family: 'Open Sans';
	font-size: 22px;
	color: ${props => props.theme.colors.text};
`;

export const BatchPrice = styled.Text`
	font-family: 'Open Sans';
	font-size: 16px;
	color: ${props => props.theme.colors.text};
`;

export const SliderContent = styled.View`
	margin: 10% 0;
`;

export const TempPrice = styled.Text`
	font-family: 'Open Sans';
	font-size: 16px;
	color: ${props => props.theme.colors.text};
`;

export const Slider = styled(RNSlider).attrs(props => ({
	minimumTrackTintColor: props.theme.colors.accent,
}))``;

export const NewPrice = styled.Text`
	font-family: 'Open Sans';
	font-size: 20px;
	color: ${props => props.theme.colors.text};
	text-align: center;
	font-weight: bold;
`;
