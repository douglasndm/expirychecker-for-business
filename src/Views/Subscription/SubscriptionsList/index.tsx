import React, { useCallback, useEffect, useState, useContext } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import Preferences from '~/Contexts/PreferencesContext';

import {
    getOfferings,
    makePurchase,
    CatPackage,
    getTeamSubscriptions,
} from '~/Functions/Team/Subscriptions';

import Loading from '~/Components/Loading';

import {
    Container,
    SubscriptionsGroup,
    SubscriptionContainer,
    SubscriptionPeriodContainer,
    TeamMembersLimit,
    DetailsContainer,
    SubscriptionDescription,
    ButtonSubscription,
    TextSubscription,
    ButtonText,
} from './styles';

const SubscriptionsList: React.FC = () => {
    const { reset } = useNavigation();

    const { preferences, setPreferences } = useContext(Preferences);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [offers, setOffers] = useState<Array<CatPackage>>([]);
    const [selected, setSelected] = useState('');

    const [currentSub, setCurrentSub] = useState<ITeamSubscription | null>();

    const loadData = useCallback(async () => {
        if (!preferences.selectedTeam) {
            showMessage({
                message: 'Team is not selected',
                type: 'danger',
            });
            return;
        }
        try {
            setIsLoading(true);

            const response = await getOfferings();

            setOffers(response);
            if (response.length > 0) {
                setSelected(response[0].package.offeringIdentifier);
            }

            const current = await getTeamSubscriptions({
                team_id: preferences.selectedTeam.team.id,
            });

            setCurrentSub(current);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [preferences.selectedTeam]);

    const handleSelectedChange = useCallback((identifier: string) => {
        setSelected(identifier);
    }, []);

    const handlePurchase = useCallback(async () => {
        if (!preferences.selectedTeam) {
            return;
        }

        try {
            setIsLoading(true);

            const selectedOffer = offers.find(
                id => id.package.offeringIdentifier === selected
            );

            if (!selectedOffer) {
                showMessage({
                    message: 'Package was not found',
                    type: 'danger',
                });
                return;
            }

            const purchase = await makePurchase({
                pack: selectedOffer.package,
                team_id: preferences.selectedTeam.team.id,
                old_sku: currentSub?.SKU_bought,
            });

            if (purchase) {
                setPreferences({
                    ...preferences,
                    selectedTeam: {
                        ...preferences.selectedTeam,
                        team: {
                            ...preferences.selectedTeam.team,
                            subscription: {
                                expireIn: purchase.expireIn,
                                membersLimit: purchase.membersLimit,
                            },
                        },
                    },
                });
            }

            showMessage({
                message: 'Assinatura realizada com sucesso!',
                type: 'info',
            });

            reset({
                routes: [{ name: 'Home' }],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [preferences, offers, currentSub, reset, selected, setPreferences]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const renderItem = useCallback(
        ({ item }) => {
            const { package: pack, type } = item;

            const { introPrice } = pack.product;
            const price = pack.product.price_string;

            let limit = translate('Subscription_TeamLimit_1person');

            switch (type) {
                case '3 people':
                    limit = translate('Subscription_TeamLimit_3people');
                    break;
                case '5 people':
                    limit = translate('Subscription_TeamLimit_5people');
                    break;
                case '10 people':
                    limit = translate('Subscription_TeamLimit_10people');
                    break;
                case '15 people':
                    limit = translate('Subscription_TeamLimit_15people');
                    break;
                default:
                    break;
            }

            return (
                <SubscriptionContainer
                    onPress={() =>
                        handleSelectedChange(pack.offeringIdentifier)
                    }
                    isSelected={selected === pack.offeringIdentifier}
                    key={pack.offeringIdentifier}
                >
                    <SubscriptionPeriodContainer
                        isSelected={selected === pack.offeringIdentifier}
                    >
                        <TeamMembersLimit>{limit}</TeamMembersLimit>
                    </SubscriptionPeriodContainer>

                    <DetailsContainer
                        isSelected={selected === pack.offeringIdentifier}
                    >
                        <SubscriptionDescription
                            isSelected={selected === pack.offeringIdentifier}
                        >
                            <TextSubscription
                                isSelected={
                                    selected === pack.offeringIdentifier
                                }
                            >
                                {!!introPrice &&
                                    `${introPrice.priceString} no primeiro mês, depois `}
                                {`${price} mensais`}
                            </TextSubscription>
                        </SubscriptionDescription>
                    </DetailsContainer>
                </SubscriptionContainer>
            );
        },
        [handleSelectedChange, selected]
    );

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            {offers.length > 0 && (
                <>
                    <SubscriptionsGroup>
                        <FlatList
                            data={offers}
                            keyExtractor={(item, index) => String(index)}
                            horizontal
                            renderItem={renderItem}
                        />
                    </SubscriptionsGroup>
                    <ButtonSubscription
                        onPress={handlePurchase}
                        disabled={isLoading}
                    >
                        <ButtonText>Assinar</ButtonText>
                    </ButtonSubscription>
                </>
            )}

            {offers.length <= 0 && (
                <ButtonSubscription disabled>
                    <TextSubscription>
                        A loja não está disponível no momento.
                    </TextSubscription>
                </ButtonSubscription>
            )}
        </Container>
    );
};

export default SubscriptionsList;
