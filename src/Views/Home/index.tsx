import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getAllProducts } from '~/Functions/Products/Products';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';

import {
    Container,
    InputSearch,
    InputTextContainer,
    InputTextIcon,
    InputTextIconContainer,
} from './styles';

const Home: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const { reset } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    const getProduts = useCallback(async () => {
        try {
            setIsLoading(true);

            if (!userPreferences.selectedTeam.team.id) {
                reset({
                    routes: [
                        {
                            name: 'TeamList',
                        },
                    ],
                });
            }

            const productsResponse = await getAllProducts({
                team_id: userPreferences.selectedTeam.team.id,
            });

            setProducts(productsResponse);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });

            if (err.message === "Team doesn't have an active subscription") {
                reset({
                    routes: [
                        {
                            name: 'Subscription',
                        },
                    ],
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [reset, userPreferences.selectedTeam.team.id]);

    useEffect(() => {
        getProduts();
    }, [getProduts]);

    useEffect(() => {
        setProductsSearch(products);
    }, [products]);

    const handleSearchChange = useCallback(
        async (search: string) => {
            setSearchString(search);

            if (search && search !== '') {
                const allProducts = await getAllProducts({});

                const findProducts = searchForAProductInAList({
                    products: allProducts,
                    searchFor: search,
                    sortByExpDate: true,
                });

                setProductsSearch(findProducts);
            } else {
                setProductsSearch(products);
            }
        },
        [products]
    );

    const handleOnBarCodeReaderOpen = useCallback(() => {
        setEnableBarCodeReader(true);
    }, []);

    const handleOnBarCodeReaderClose = useCallback(() => {
        setEnableBarCodeReader(false);
    }, []);

    const handleOnCodeRead = useCallback(
        code => {
            setSearchString(code);
            handleSearchChange(code);
            setEnableBarCodeReader(false);
        },
        [handleSearchChange]
    );

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {enableBarCodeReader ? (
                <BarCodeReader
                    onCodeRead={handleOnCodeRead}
                    onClose={handleOnBarCodeReaderClose}
                />
            ) : (
                <Container>
                    <Header title={userPreferences.selectedTeam.team.name} />

                    {products.length > 0 && (
                        <InputTextContainer>
                            <InputSearch
                                placeholder={translate('View_Home_SearchText')}
                                value={searchString}
                                onChangeText={handleSearchChange}
                            />
                            <InputTextIconContainer
                                onPress={handleOnBarCodeReaderOpen}
                            >
                                <InputTextIcon name="barcode-outline" />
                            </InputTextIconContainer>
                        </InputTextContainer>
                    )}

                    <ListProducts products={productsSearch} isHome />
                </Container>
            )}
        </>
    );
};

export default Home;
