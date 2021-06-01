import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import SubscriptionsList from './SubscriptionsList';

import {
    Container,
    HeaderContainer,
    TitleContainer,
    IntroductionText,
    AppNameTitle,
    PremiumTitle,
    AdvantagesGroup,
    AdvantageContainer,
    AdvantageText,
    ButtonSubscription,
    TextSubscription,
    TermsPrivacyText,
    TermsPrivacyLink,
} from './styles';

const Subscription: React.FC = () => {
    const { navigate } = useNavigation();

    const handleNavigateHome = useCallback(() => {
        navigate('Home');
    }, [navigate]);

    const navigateToTerms = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/terms');
    }, []);

    const navigateToPrivacy = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/privacy');
    }, []);

    return (
        <Container>
            <HeaderContainer>
                <TitleContainer>
                    <AppNameTitle>VALIDADES PARA EMPRESAS</AppNameTitle>
                    <IntroductionText>
                        CONHEÇA AS VANTAGENS DAS
                    </IntroductionText>
                    <PremiumTitle>ASSINATURAS</PremiumTitle>
                </TitleContainer>
            </HeaderContainer>

            <AdvantagesGroup>
                <AdvantageContainer>
                    <AdvantageText>
                        Produtos sincronizados com todo seu time.
                    </AdvantageText>
                </AdvantageContainer>

                <AdvantageContainer>
                    <AdvantageText>Melhor controle do estoque.</AdvantageText>
                </AdvantageContainer>

                <AdvantageContainer>
                    <AdvantageText>Notificações diárias</AdvantageText>
                </AdvantageContainer>

                <AdvantageContainer>
                    <AdvantageText>
                        Exporte seus produtos para Excel
                    </AdvantageText>
                </AdvantageContainer>
            </AdvantagesGroup>

            <SubscriptionsList />

            <ButtonSubscription onPress={handleNavigateHome}>
                <TextSubscription>Voltar</TextSubscription>
            </ButtonSubscription>

            <TermsPrivacyText>
                Continuando com a assinatura você está concordando com nossos
                <TermsPrivacyLink onPress={navigateToTerms}>
                    {` ${translate('Terms')}`}
                </TermsPrivacyLink>
                {translate('BetweenTermsAndPrivacy')}
                <TermsPrivacyLink onPress={navigateToPrivacy}>
                    {translate('PrivacyPolicy')}
                </TermsPrivacyLink>
                .
            </TermsPrivacyText>
        </Container>
    );
};

export default Subscription;