import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

import { translate } from '../../Locales';

import {
    getSubscriptionDetails,
    makeSubscription,
    isSubscriptionActive,
} from '../../Functions/ProMode';
import { isUserSignedIn } from '~/Functions/Auth';

import Loading from '../../Components/Loading';
import Notification from '../../Components/Notification';

import PreferencesContext from '../../Contexts/PreferencesContext';

import {
    Container,
    Scroll,
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
    LoadingIndicator,
    SubscriptionsGroup,
    SubscriptionContainer,
    SubscriptionPeriodContainer,
    SubscriptionPeriod,
    DetailsContainer,
    SubscriptionDescription,
    SubscriptionPrice,
    SubscriptionIntroPrice,
} from './styles';

const Pro: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [isLoadingMakeSubscription, setIsLoadingMakeSubscription] = useState<
        boolean
    >(false);
    const [selectedPlan, setSelectedPlan] = useState<string | undefined>();

    const [monthlyPlan, setMonthlyPlan] = useState<
        PurchasesPackage | undefined
    >();
    const [quarterlyPlan, setQuarterlyPlan] = useState<
        PurchasesPackage | undefined
    >();
    const [annualPlan, setAnnualPlan] = useState<
        PurchasesPackage | undefined
    >();

    const [alreadyPremium, setAlreadyPremium] = useState(false);

    const { navigate } = useNavigation();

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const alreaderSignedIn = await isUserSignedIn();

            if (alreaderSignedIn !== true) return;

            const alreadyProUser = await isSubscriptionActive();
            setAlreadyPremium(alreadyProUser);

            const response = await getSubscriptionDetails();

            response.forEach((packageItem) => {
                if (packageItem.packageType === PACKAGE_TYPE.MONTHLY) {
                    setMonthlyPlan(packageItem);
                    return;
                }
                if (packageItem.packageType === PACKAGE_TYPE.THREE_MONTH) {
                    setQuarterlyPlan(packageItem);
                    return;
                }

                if (packageItem.packageType === PACKAGE_TYPE.ANNUAL) {
                    setAnnualPlan(packageItem);
                }
            });
        } catch (err) {
            // setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleMakeSubscription = useCallback(async () => {
        try {
            setIsLoadingMakeSubscription(true);
            if (
                selectedPlan !== 'annual' &&
                selectedPlan !== 'quarterly' &&
                selectedPlan !== 'monthly'
            ) {
                setError('Selecione o plano');
                return;
            }

            let plan = null;

            if (selectedPlan === 'annual') {
                plan = annualPlan;
            } else if (selectedPlan === 'quarterly') {
                plan = quarterlyPlan;
            } else if (selectedPlan === 'monthly') {
                plan = monthlyPlan;
            }
            if (!plan) {
                throw new Error('Plan dint found');
            }

            await makeSubscription(plan);

            setUserPreferences({
                ...userPreferences,
                isUserPremium: true,
            });

            navigate('Home');
        } catch (err) {
            if (err.message === 'User cancel payment') {
                return;
            }
            setError(err.message);
        } finally {
            setIsLoadingMakeSubscription(false);
        }
    }, [
        selectedPlan,
        setUserPreferences,
        userPreferences,
        navigate,
        annualPlan,
        quarterlyPlan,
        monthlyPlan,
    ]);

    const handleNavigateHome = useCallback(() => {
        navigate('Home');
    }, [navigate]);

    const handleNavigateToSignIn = useCallback(() => {
        navigate('SignIn');
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    const handleChangePlanMonthly = useCallback(() => {
        setSelectedPlan('monthly');
    }, []);

    const handleChangePlanQuarterly = useCallback(() => {
        setSelectedPlan('quarterly');
    }, []);

    const handleChangePlanAnnual = useCallback(() => {
        setSelectedPlan('annual');
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <Scroll>
                    <HeaderContainer>
                        <TitleContainer>
                            <IntroductionText>
                                {translate('View_ProPage_MeetPRO')}
                            </IntroductionText>
                            <AppNameTitle>{translate('AppName')}</AppNameTitle>
                            <PremiumTitle>
                                {translate('View_ProPage_ProLabel')}
                            </PremiumTitle>
                        </TitleContainer>
                    </HeaderContainer>

                    <AdvantagesGroup>
                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageOne')}
                            </AdvantageText>
                        </AdvantageContainer>

                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageSeven')}
                            </AdvantageText>
                        </AdvantageContainer>

                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageTwo')}
                            </AdvantageText>
                        </AdvantageContainer>

                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageThree')}
                            </AdvantageText>
                        </AdvantageContainer>
                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageFour')}
                            </AdvantageText>
                        </AdvantageContainer>
                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageSix')}
                            </AdvantageText>
                        </AdvantageContainer>
                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageFive')}
                            </AdvantageText>
                        </AdvantageContainer>
                    </AdvantagesGroup>

                    {userPreferences.isUserSignedIn ? (
                        <>
                            {alreadyPremium ? (
                                <ButtonSubscription>
                                    <TextSubscription>
                                        {translate(
                                            'View_ProPage_UserAlreadyPro'
                                        )}
                                    </TextSubscription>
                                </ButtonSubscription>
                            ) : (
                                <>
                                    <SubscriptionsGroup>
                                        {monthlyPlan && (
                                            <SubscriptionContainer
                                                onPress={
                                                    handleChangePlanMonthly
                                                }
                                                isSelected={
                                                    !!selectedPlan &&
                                                    selectedPlan === 'monthly'
                                                }
                                            >
                                                <SubscriptionPeriodContainer>
                                                    <SubscriptionPeriod>
                                                        Mensal
                                                    </SubscriptionPeriod>
                                                </SubscriptionPeriodContainer>

                                                <DetailsContainer>
                                                    <SubscriptionDescription
                                                        isSelected={
                                                            !!selectedPlan &&
                                                            selectedPlan ===
                                                                'monthly'
                                                        }
                                                    >
                                                        <SubscriptionIntroPrice
                                                            isSelected={
                                                                !!selectedPlan &&
                                                                selectedPlan ===
                                                                    'monthly'
                                                            }
                                                        >
                                                            {
                                                                monthlyPlan
                                                                    .product
                                                                    .intro_price_string
                                                            }
                                                        </SubscriptionIntroPrice>{' '}
                                                        no primeiro mês e depois
                                                        <SubscriptionPrice
                                                            isSelected={
                                                                !!selectedPlan &&
                                                                selectedPlan ===
                                                                    'monthly'
                                                            }
                                                        >
                                                            {' '}
                                                            {
                                                                monthlyPlan
                                                                    .product
                                                                    .price_string
                                                            }
                                                        </SubscriptionPrice>{' '}
                                                        mensais
                                                    </SubscriptionDescription>
                                                </DetailsContainer>
                                            </SubscriptionContainer>
                                        )}

                                        {quarterlyPlan && (
                                            <SubscriptionContainer
                                                onPress={
                                                    handleChangePlanQuarterly
                                                }
                                                isSelected={
                                                    !!selectedPlan &&
                                                    selectedPlan === 'quarterly'
                                                }
                                                style={{
                                                    marginLeft: 10,
                                                    marginRight: 10,
                                                }}
                                            >
                                                <SubscriptionPeriodContainer>
                                                    <SubscriptionPeriod>
                                                        Trimestral
                                                    </SubscriptionPeriod>
                                                </SubscriptionPeriodContainer>

                                                <DetailsContainer>
                                                    <SubscriptionDescription
                                                        isSelected={
                                                            !!selectedPlan &&
                                                            selectedPlan ===
                                                                'quarterly'
                                                        }
                                                    >
                                                        {!!quarterlyPlan.product
                                                            .intro_price_string && (
                                                            <SubscriptionIntroPrice>
                                                                {
                                                                    quarterlyPlan
                                                                        .product
                                                                        .intro_price_string
                                                                }{' '}
                                                                nos primeiros
                                                                três meses e
                                                                depois{' '}
                                                            </SubscriptionIntroPrice>
                                                        )}
                                                        <SubscriptionPrice
                                                            isSelected={
                                                                !!selectedPlan &&
                                                                selectedPlan ===
                                                                    'quarterly'
                                                            }
                                                        >
                                                            {
                                                                quarterlyPlan
                                                                    .product
                                                                    .price_string
                                                            }
                                                        </SubscriptionPrice>{' '}
                                                        trimestrais
                                                    </SubscriptionDescription>
                                                </DetailsContainer>
                                            </SubscriptionContainer>
                                        )}

                                        {annualPlan && (
                                            <SubscriptionContainer
                                                onPress={handleChangePlanAnnual}
                                                isSelected={
                                                    !!selectedPlan &&
                                                    selectedPlan === 'annual'
                                                }
                                            >
                                                <SubscriptionPeriodContainer
                                                    isSelected
                                                >
                                                    <SubscriptionPeriod>
                                                        Anual
                                                    </SubscriptionPeriod>
                                                </SubscriptionPeriodContainer>
                                                <DetailsContainer>
                                                    <SubscriptionDescription
                                                        isSelected={
                                                            !!selectedPlan &&
                                                            selectedPlan ===
                                                                'annual'
                                                        }
                                                    >
                                                        <SubscriptionPrice
                                                            isSelected={
                                                                !!selectedPlan &&
                                                                selectedPlan ===
                                                                    'annual'
                                                            }
                                                        >
                                                            {
                                                                annualPlan
                                                                    .product
                                                                    .price_string
                                                            }
                                                        </SubscriptionPrice>{' '}
                                                        Anuais
                                                    </SubscriptionDescription>
                                                </DetailsContainer>
                                            </SubscriptionContainer>
                                        )}
                                    </SubscriptionsGroup>

                                    {monthlyPlan ||
                                    quarterlyPlan ||
                                    annualPlan ? (
                                        <ButtonSubscription
                                            onPress={handleMakeSubscription}
                                            disabled={isLoadingMakeSubscription}
                                        >
                                            {isLoadingMakeSubscription && (
                                                <LoadingIndicator />
                                            )}
                                            {!isLoadingMakeSubscription && (
                                                <>
                                                    <TextSubscription>
                                                        Assinar
                                                    </TextSubscription>
                                                </>
                                            )}
                                        </ButtonSubscription>
                                    ) : (
                                        <ButtonSubscription disabled>
                                            <TextSubscription>
                                                {translate(
                                                    'View_ProPage_SubscriptionNotAvailable'
                                                )}
                                            </TextSubscription>
                                        </ButtonSubscription>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <ButtonSubscription
                                onPress={handleNavigateToSignIn}
                            >
                                <TextSubscription>
                                    {translate(
                                        'View_ProPage_Button_ClickToSignIn'
                                    )}
                                </TextSubscription>
                            </ButtonSubscription>
                        </>
                    )}

                    <ButtonSubscription onPress={handleNavigateHome}>
                        <TextSubscription>
                            {translate('View_ProPage_Button_GoBackToHome')}
                        </TextSubscription>
                    </ButtonSubscription>
                </Scroll>
            </Container>
            {!!error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                    onPress={handleDimissNotification}
                />
            )}
        </>
    );
};

export default Pro;
