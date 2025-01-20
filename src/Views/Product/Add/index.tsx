import React, { useState, useEffect, useCallback, useContext } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import PreferencesContext from '@teams/Contexts/PreferencesContext';
import { useTeam } from '@teams/Contexts/TeamContext';

import { createProduct } from '@teams/Functions/Products/Product';
import { createBatch } from '@teams/Functions/Products/Batches/Batch';
import { uploadImage } from '@teams/Functions/Product/Image';
import { getExtraInfoForProducts } from '@teams/Functions/Products/ExtraInfo';
import { findDuplicate } from '@teams/Functions/Products/FindDuplicate';

import { findProductByCode } from '@utils/Product/FindByEAN';

import Loading from '@components/Loading';
import Camera from '@components/Camera';
import BarCodeReader from '@components/BarCodeReader';
import Header from '@components/Header';
import Dialog from '@components/Dialog';
import PaddingComponent from '@components/PaddingComponent';

import ProductName from '@views/Product/Add/Components/Inputs/ProductName';
import ProductBatch from '@views/Product/Add/Components/Inputs/ProductBatch';
import ProductCount from '@views/Product/Add/Components/Inputs/ProductCount';
import BatchPrice from '@views/Product/Add/Components/Inputs/BatchPrice';
import BatchExpDate from '@views/Product/Add/Components/Inputs/BatchExpDate';

import BrandSelect from '@teams/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '@teams/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '@teams/Components/Product/Inputs/Pickers/Store';

import {
	ImageContainer,
	ProductImage,
	ProductImageContainer,
} from '@shared/Views/Product/Add/styles';
import {
	Container,
	PageContent,
	InputContainer,
	InputTextTip,
	InputGroup,
	MoreInformationsContainer,
	InputCodeTextContainer,
	Icon,
	InputTextLoading,
	InputCodeText,
	InputTextIconContainer,
	Content,
	MoreInformationsTitle,
} from './styles';

interface Request {
	route: {
		params: {
			code?: string;
			category?: string;
			brand?: string;
			store?: string;
		};
	};
}

const Add: React.FC<Request> = ({ route }: Request) => {
	const { replace, navigate } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const { brand, category, store, code: routeCode } = route.params;

	const { preferences } = useContext(PreferencesContext);
	const teamContext = useTeam();

	const [name, setName] = useState('');
	const [batch, setBatch] = useState('');
	const [amount, setAmount] = useState<number | null>(null);
	const [price, setPrice] = useState<number | null>(null);
	const [expDate, setExpDate] = useState(new Date());
	const [photoPath, setPhotoPath] = useState('');

	const [selectedBrand, setSelectedBrand] = useState<string | null>(() => {
		return brand || null;
	});

	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		() => {
			return category || null;
		}
	);

	const [selectedStore, setSelectedStore] = useState<string | null>(() => {
		return store || null;
	});

	const [categories, setCategories] = useState<Array<IPickerItem>>([]);
	const [brands, setBrands] = useState<Array<IPickerItem>>([]);
	const [stores, setStores] = useState<Array<IPickerItem>>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [isFindingProd, setIsFindingProd] = useState<boolean>(false);

	const [productFinded, setProductFinded] = useState<boolean>(false);
	const [productNameFinded, setProductNameFinded] = useState<null | string>(
		null
	);
	const [showProdFindedModal, setShowProdFindedModal] = useState(false);
	const [showModalDuplicate, setShowModalDuplicate] = useState(false);

	const [codeFieldError, setCodeFieldError] = useState<boolean>(false);
	const [duplicateId, setDuplicateId] = useState('');

	const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);
	const [enableCamera, setEnableCamera] = useState(false);

	const handleCompleteInfo = useCallback(() => {
		if (productNameFinded?.trim()) {
			setName(productNameFinded.trim());
			setShowProdFindedModal(false);
		}
	}, [productNameFinded]);

	const completeInfo = useCallback(
		(prodName?: string) => {
			if (prodName) {
				setName(prodName.trim() || '');

				setShowProdFindedModal(false);
			} else if (productNameFinded) {
				setName(productNameFinded.trim());

				setShowProdFindedModal(false);
			}
		},
		[productNameFinded]
	);

	const findProductByEAN = useCallback(
		async (ean_code: string) => {
			const queryWithoutLetters = ean_code.replace(/\D/g, '').trim();
			const query = queryWithoutLetters.replace(/^0+/, ''); // Remove zero on begin

			if (query.length < 8) return;

			if (query.trim() !== '') {
				// if (getLocales()[0].languageCode === 'pt') {
				try {
					setIsFindingProd(true);

					if (query === '') return;

					const response = await findProductByCode(query);

					if (response !== null && !!response.name) {
						setProductFinded(true);
						setProductNameFinded(response.name);

						if (preferences.autoComplete) {
							completeInfo(response.name);
						}
					} else {
						setProductFinded(false);

						setProductNameFinded(null);
					}
				} finally {
					setIsFindingProd(false);
				}
				// }
			} else {
				setProductFinded(false);
			}
		},
		[completeInfo, preferences.autoComplete]
	);

	const [code, setCode] = useState(() => {
		if (routeCode) {
			findProductByEAN(routeCode);
			return routeCode;
		}
		return '';
	});

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await getExtraInfoForProducts();

			const categoriesArray: Array<ICategoryItem> = [];
			response.availableCategories.forEach(cat =>
				categoriesArray.push({
					key: cat.id,
					label: cat.name,
					value: cat.id,
				})
			);
			setCategories(categoriesArray);

			const brandsArray: Array<IBrandItem> = [];

			response.availableBrands.forEach(brand =>
				brandsArray.push({
					key: brand.id,
					label: brand.name,
					value: brand.id,
				})
			);

			setBrands(brandsArray);

			const storesArray: Array<IPickerItem> = [];

			response.availableStores.forEach(store =>
				storesArray.push({
					key: store.id,
					label: store.name,
					value: store.id,
				})
			);

			setStores(storesArray);

			const { roleInTeam } = teamContext;

			if (roleInTeam) {
				if (roleInTeam.role.toLowerCase() !== 'manager') {
					if (roleInTeam.store) {
						const store = storesArray.find(
							sto => sto.key === roleInTeam.store?.id
						);

						if (store) setSelectedStore(store.value);
					}
				}
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [teamContext]);

	const handleSwitchFindModal = useCallback(() => {
		setShowProdFindedModal(!showProdFindedModal);
	}, [showProdFindedModal]);

	const handleNavigateToAddBatch = useCallback(() => {
		if (!!duplicateId && duplicateId.trim() !== '')
			navigate('AddBatch', { productId: duplicateId });
	}, [duplicateId, navigate]);

	const addBatch = useCallback(async () => {
		if (!duplicateId || (duplicateId && duplicateId.trim() === '')) return;

		try {
			setIsLoading(true);

			await createBatch({
				productId: duplicateId,
				batch: {
					name: batch || '01',
					exp_date: String(expDate),
					amount: Number(amount),
					price: Number(price),
					status: 'unchecked',
				},
			});

			showMessage({
				message: 'O lote foi adicionado ao produto existente',
				type: 'info',
			});

			replace('ProductDetails', {
				id: duplicateId,
			});
		} finally {
			setIsLoading(false);
		}
	}, [amount, batch, duplicateId, expDate, price, replace]);

	const findDuplicateProducts = useCallback(async () => {
		try {
			if (!name) return;
			const isDuplicate = await findDuplicate({
				name,
				code,
				store_id: selectedStore || undefined,
			});

			if (isDuplicate.product_id) setDuplicateId(isDuplicate.product_id);
			setCodeFieldError(isDuplicate.isDuplicate);
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		}
	}, [code, name, selectedStore]);

	const handleCodeBlur = useCallback(
		(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			if (code) {
				findProductByEAN(code);
				findDuplicateProducts();
			}
		},
		[code, findDuplicateProducts, findProductByEAN]
	);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleSave = useCallback(async () => {
		if (name.trim() === '') {
			return;
		}

		if (codeFieldError) {
			setShowModalDuplicate(true);
			return;
		}
		try {
			setIsLoading(true);
			let prodCategory: string | undefined;

			if (selectedCategory && selectedCategory !== 'null') {
				prodCategory = selectedCategory;
			}

			const createdProduct = await createProduct({
				product: {
					name,
					code,
					brand: selectedBrand || undefined,
					store: selectedStore || undefined,
					batches: [],
				},
				category: prodCategory,
			});

			await createBatch({
				productId: createdProduct.id,
				batch: {
					name: batch || '01',
					exp_date: String(expDate),
					amount: Number(amount),
					price: Number(price),
					status: 'unchecked',
				},
			});

			if (!!photoPath) {
				await uploadImage({
					product_id: createdProduct.id,
					path: photoPath,
				});

				// await saveLocally(photoPath, createdProduct.id);
			}

			showMessage({
				message: strings.View_Success_ProductCreated,
				type: 'info',
			});

			replace('ProductDetails', {
				id: createdProduct.id,
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [
		name,
		codeFieldError,
		selectedCategory,
		code,
		selectedBrand,
		selectedStore,
		batch,
		expDate,
		amount,
		price,
		photoPath,
		replace,
	]);

	const handleSwitchCodeReader = useCallback(() => {
		setIsBarCodeEnabled(prevState => !prevState);
	}, []);

	const switchCameraEnable = useCallback(() => {
		setEnableCamera(prevState => !prevState);
	}, []);

	const handleSwitchDupliateModal = useCallback(() => {
		setShowModalDuplicate(prevState => !prevState);
	}, []);

	const handleOnCodeRead = useCallback(
		async (codeRead: string) => {
			setCode(codeRead);
			setIsBarCodeEnabled(false);
			await findProductByEAN(codeRead);
			await findDuplicateProducts();
		},
		[findDuplicateProducts, findProductByEAN]
	);

	const onPhotoTaken = useCallback((path: string) => {
		setPhotoPath(path);
		setEnableCamera(false);
	}, []);

	const handleCodeChange = useCallback((value: string) => {
		setCode(value);
		setCodeFieldError(false);
	}, []);

	return enableCamera ? (
		<Camera
			onPhotoTaken={onPhotoTaken}
			switchEnableCamera={switchCameraEnable}
		/>
	) : (
		<Container>
			{isBarCodeEnabled ? (
				<BarCodeReader
					onCodeRead={handleOnCodeRead}
					onClose={handleSwitchCodeReader}
				/>
			) : (
				<>
					<Header
						title={strings.View_AddProduct_PageTitle}
						noDrawer
						appBarActions={[
							{
								icon: 'content-save-outline',
								onPress: handleSave,
								disabled: isLoading,
							},
						]}
					/>

					{isLoading ? (
						<Loading />
					) : (
						<Content>
							<PageContent>
								{!!photoPath && (
									<ImageContainer>
										<ProductImageContainer>
											<ProductImage
												source={{
													uri: `file://${photoPath}`,
												}}
											/>
										</ProductImageContainer>
									</ImageContainer>
								)}

								<InputContainer>
									<ProductName
										name={name}
										setName={setName}
										handleEnableCamera={switchCameraEnable}
									/>

									<InputCodeTextContainer
										hasError={codeFieldError}
									>
										<InputCodeText
											placeholder={
												strings.View_AddProduct_InputPlacehoder_Code
											}
											accessibilityLabel={
												strings.View_AddProduct_InputAccessibility_Code
											}
											value={code}
											onBlur={handleCodeBlur}
											onChangeText={handleCodeChange}
										/>
										<InputTextIconContainer
											onPress={handleSwitchCodeReader}
										>
											<Icon
												name="barcode-outline"
												size={34}
											/>
										</InputTextIconContainer>

										{isFindingProd && <InputTextLoading />}

										{productFinded && !isFindingProd && (
											<InputTextIconContainer
												style={{
													marginTop: -5,
												}}
												onPress={handleSwitchFindModal}
											>
												<Icon
													name="download"
													size={30}
												/>
											</InputTextIconContainer>
										)}
									</InputCodeTextContainer>
									{codeFieldError && (
										<InputTextTip
											onPress={handleNavigateToAddBatch}
										>
											O produto já está cadastrado
										</InputTextTip>
									)}

									<MoreInformationsContainer>
										<MoreInformationsTitle>
											{
												strings.View_AddProduct_MoreInformation_Label
											}
										</MoreInformationsTitle>

										<InputGroup>
											<ProductBatch
												batch={batch}
												setBatch={setBatch}
											/>
											<ProductCount
												amount={amount}
												setAmount={setAmount}
											/>
										</InputGroup>

										<BatchPrice
											price={price}
											setPrice={setPrice}
										/>

										<CategorySelect
											categories={categories}
											onChange={setSelectedCategory}
											defaultValue={selectedCategory}
											containerStyle={{
												marginBottom: 10,
											}}
										/>

										<BrandSelect
											brands={brands}
											onChange={setSelectedBrand}
											defaultValue={selectedBrand}
											containerStyle={{
												marginBottom: 10,
											}}
										/>
										{teamContext.roleInTeam?.role.toLowerCase() ===
											'manager' && (
											<StoreSelect
												stores={stores}
												defaultValue={selectedStore}
												onChange={setSelectedStore}
												containerStyle={{
													marginBottom: 10,
												}}
											/>
										)}
									</MoreInformationsContainer>

									<BatchExpDate
										expDate={expDate}
										setExpDate={setExpDate}
									/>
								</InputContainer>
							</PageContent>

							<Dialog
								visible={showProdFindedModal}
								title={
									strings.View_AddProduct_FillInfo_Modal_Title
								}
								description={
									strings.View_AddProduct_FillInfo_Modal_Description
								}
								cancelText={
									strings.View_AddProduct_FillInfo_Modal_No
								}
								confirmText={
									strings.View_AddProduct_FillInfo_Modal_Yes
								}
								onConfirm={handleCompleteInfo}
								onDismiss={handleSwitchFindModal}
								onCancel={handleSwitchFindModal}
							/>
							<PaddingComponent />
						</Content>
					)}
				</>
			)}

			<Dialog
				visible={showModalDuplicate}
				title="Este produto já existe"
				description="Você deseja adicionar um lote ao produto existente?"
				cancelText="Adicionar lote"
				confirmText="Cancelar"
				onCancel={addBatch}
				onDismiss={handleSwitchDupliateModal}
				onConfirm={handleSwitchDupliateModal}
			/>
		</Container>
	);
};

export default Add;
