import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { exists } from 'react-native-fs';
import { getLocales } from 'react-native-localize';
import { format, parseISO } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import BackButton from '~/Components/BackButton';

import { getProduct } from '~/Functions/Products/Product';

import { ShareProductImageWithText } from '~/Functions/Share';
import { getProductImagePath } from '~/Functions/Products/Image';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    ScrollView,
    PageHeader,
    ProductContainer,
    PageTitleContent,
    PageTitle,
    ProductInformationContent,
    ProductName,
    ProductCode,
    ProductInfo,
    ProductImageContainer,
    ProductImage,
    ActionsButtonContainer,
    ActionButton,
    PageContent,
    Icons,
    CategoryDetails,
    CategoryDetailsText,
    TableContainer,
    FloatButton,
} from './styles';

import BatchTable from './Components/BatchesTable';
import { logoutFirebase } from '~/Functions/Auth/Firebase';

interface Request {
    route: {
        params: {
            id: string;
        };
    };
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
    const { preferences } = useContext(PreferencesContext);

    const { navigate, reset, goBack } = useNavigation();

    const productId = useMemo(() => {
        return route.params.id;
    }, [route.params.id]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const dateFormat = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    }, []);

    const [photo, setPhoto] = useState<string | null>(null);
    const [product, setProduct] = useState<IProduct>();

    const [lotesTratados, setLotesTratados] = useState<Array<IBatch>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<IBatch>>([]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getProduct({ productId });

            if ('error' in response) {
                showMessage({
                    message: response.error,
                    type: 'danger',
                });

                if (response.status === 401) {
                    await logoutFirebase();

                    reset({
                        routes: [
                            {
                                name: 'Login',
                            },
                        ],
                    });
                }
                return;
            }

            setProduct(response);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [productId, reset]);

    const addNewLote = useCallback(() => {
        navigate('AddLote', { productId });
    }, [navigate, productId]);

    const handleEdit = useCallback(() => {
        navigate('EditProduct', { product: JSON.stringify(product) });
    }, [navigate, product]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (product) {
            setLotesTratados(() =>
                product?.batches.filter(batch => batch.status === 'checked')
            );

            setLotesNaoTratados(() =>
                product?.batches.filter(batch => batch.status !== 'checked')
            );
        }
    }, [product]);

    const handleOnPhotoPress = useCallback(() => {
        if (product && product.photo) {
            navigate('PhotoView', {
                productId,
            });
        }
    }, [navigate, product, productId]);

    const handleShare = useCallback(async () => {
        if (product) {
            if (lotesNaoTratados.length > 0) {
                const expireDate = lotesNaoTratados[0].exp_date;

                await ShareProductImageWithText({
                    productId,
                    title: strings.View_ShareProduct_Title,
                    text: strings.View_ShareProduct_Message.replace(
                        '{PRODUCT}',
                        product.name
                    ).replace(
                        '{DATE}',
                        format(parseISO(expireDate), dateFormat)
                    ),
                });
            }
        }
    }, [productId, product, lotesNaoTratados, dateFormat]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <StatusBar />
                <ScrollView>
                    <PageHeader>
                        <PageTitleContent>
                            <BackButton handleOnPress={goBack} />
                            <PageTitle>
                                {strings.View_ProductDetails_PageTitle}
                            </PageTitle>
                        </PageTitleContent>

                        {!!product && (
                            <ProductContainer>
                                {preferences.isUserPremium && !!photo && (
                                    <ProductImageContainer
                                        onPress={handleOnPhotoPress}
                                    >
                                        <ProductImage
                                            source={{
                                                uri: photo,
                                            }}
                                        />
                                    </ProductImageContainer>
                                )}
                                <ProductInformationContent>
                                    <ProductName>
                                        {!!product && product?.name}
                                    </ProductName>
                                    {!!product.code && product?.code && (
                                        <ProductCode>
                                            {strings.View_ProductDetails_Code}:{' '}
                                            {product.code}
                                        </ProductCode>
                                    )}
                                    <ProductInfo>
                                        {product.categories.length > 0 &&
                                            `${strings.View_ProductDetails_Categories}: ${product.categories[0].name}`}
                                    </ProductInfo>

                                    <ActionsButtonContainer>
                                        <ActionButton
                                            icon={() => (
                                                <Icons
                                                    name="create-outline"
                                                    size={22}
                                                />
                                            )}
                                            onPress={handleEdit}
                                        >
                                            {
                                                strings.View_ProductDetails_Button_UpdateProduct
                                            }
                                        </ActionButton>

                                        {lotesNaoTratados.length > 0 && (
                                            <ActionButton
                                                icon={() => (
                                                    <Icons
                                                        name="share-social-outline"
                                                        size={22}
                                                    />
                                                )}
                                                onPress={handleShare}
                                            >
                                                {
                                                    strings.View_ProductDetails_Button_ShareProduct
                                                }
                                            </ActionButton>
                                        )}
                                    </ActionsButtonContainer>
                                </ProductInformationContent>
                            </ProductContainer>
                        )}
                    </PageHeader>

                    <PageContent>
                        {lotesNaoTratados.length > 0 && (
                            <TableContainer>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        {
                                            strings.View_ProductDetails_TableTitle_NotTreatedBatches
                                        }
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <BatchTable
                                    batches={lotesNaoTratados}
                                    productId={productId}
                                />
                            </TableContainer>
                        )}

                        {lotesTratados.length > 0 && (
                            <>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        {
                                            strings.View_ProductDetails_TableTitle_TreatedBatches
                                        }
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <BatchTable
                                    batches={lotesTratados}
                                    productId={productId}
                                />
                            </>
                        )}
                    </PageContent>
                </ScrollView>
            </Container>

            <FloatButton
                icon={() => (
                    <Ionicons name="add-outline" color="white" size={22} />
                )}
                small
                label={strings.View_ProductDetails_FloatButton_AddNewBatch}
                onPress={addNewLote}
            />
        </>
    );
};

export default ProductDetails;
