import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { captureException } from '@services/ExceptionsHandler';

import { useTeam } from '@teams/Contexts/TeamContext';

import { exportToExcel } from '@utils/Excel/Export';
import { searchProducts } from '@utils/Product/Search';

import { getAllProductsFromStore } from '@teams/Functions/Team/Stores/Products';

import HomeComponent from '@views/Home';
import ListProducts from '@components/Product/List';
import FloatButton from '@components/FloatButton';

import {
	Container,
	ItemTitle,
	TitleContainer,
} from '@styles/Views/GenericViewPage';
import {
	deleteManyProducts,
	getAllProducts,
} from '@teams/Functions/Products/Products';
import { getAllBrands } from '@teams/Functions/Brand';
import { getAllCategoriesFromTeam } from '@teams/Functions/Categories';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';

interface Props {
	store_id: string;
	store_name: string;
}

const StoreView: React.FC = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const routeParams = params as Props;

	interface listProdsRefProps {
		switchDeleteModal: () => void;
		switchSelectMode: () => void;
	}

	const listProdsRef = useRef<listProdsRefProps>();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [selectMode, setSelectMode] = useState(false);

	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [searchQuery, setSearchQuery] = React.useState('');

	const [storeName] = useState<string>(() => routeParams.store_name);

	const [products, setProducts] = useState<IProduct[]>([]);

	const isManager = useMemo(() => {
		if (
			!!teamContext.roleInTeam &&
			teamContext.roleInTeam.role.toLowerCase() === 'manager'
		) {
			return true;
		}
		return false;
	}, [teamContext.roleInTeam]);

	const hasPermission = useMemo(() => {
		if (!teamContext.roleInTeam) return false;

		const { role } = teamContext.roleInTeam;

		if (role.toLowerCase() === 'manager') return true;
		if (role.toLowerCase() === 'supervisor') return true;
		return false;
	}, [teamContext.roleInTeam]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await getAllProductsFromStore({
				store_id: routeParams.store_id,
			});

			setProducts(response);
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error, showAlert: true });
			}
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.store_id]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleEdit = useCallback(() => {
		navigate('StoreEdit', { store_id: routeParams.store_id });
	}, [navigate, routeParams.store_id]);

	const handleExportExcel = useCallback(async () => {
		try {
			setIsLoading(true);

			const getProducts = async () =>
				getAllProducts({
					removeCheckedBatches: false,
				});
			const getBrands = async () => getAllBrands();
			const getCategories = async () => getAllCategoriesFromTeam();
			const getStores = async () => getAllStoresFromTeam();

			await exportToExcel({
				store: routeParams.store_id,
				getProducts,
				getBrands,
				getCategories,
				getStores,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_StoreView');

			showMessage({
				message: strings.View_Brand_View_SuccessExportExcel,
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error)
				if (!err.message.includes('did not share')) {
					showMessage({
						message: err.message,
						type: 'danger',
					});
				}
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.store_id]);

	const handleSearchChange = useCallback(
		async (search: string) => {
			setSearchQuery(search);

			if (search.trim() === '') {
				setProductsSearch(products);
			}
		},
		[products]
	);

	const handleSearch = useCallback(
		(value?: string) => {
			const query = value && value.trim() !== '' ? value : searchQuery;

			let prods: IProduct[] = [];

			if (query && query !== '') {
				prods = searchProducts({
					products,
					query,
				});
			}

			setProductsSearch(prods);
		},
		[products, searchQuery]
	);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleDeleteMany = useCallback(
		async (idsToDelete: string[] | number[]) => {
			if (idsToDelete.length <= 0) return;

			try {
				const ids = idsToDelete.map(id => String(id));

				await deleteManyProducts({
					productsIds: ids,
				});

				await loadData();
			} catch (err) {
				if (err instanceof Error)
					showMessage({
						message: err.message,
						type: 'danger',
					});
			}
		},
		[loadData]
	);

	const handleSwitchSelectMode = useCallback(() => {
		setSelectMode(prevState => !prevState);

		if (listProdsRef.current) {
			listProdsRef.current.switchSelectMode();
		}
	}, []);

	const handleSwitchDeleteModal = useCallback(() => {
		if (listProdsRef.current?.switchDeleteModal) {
			listProdsRef.current.switchDeleteModal();
		}
	}, []);

	return (
		<Container>
			<HomeComponent
				title="Loja"
				showBackButton
				searchValue={searchQuery}
				onSearchTextChange={handleSearchChange}
				onSearch={handleSearch}
				searchFor={handleSearch}
				onExcelExport={handleExportExcel}
				onNavigateToEdit={isManager ? handleEdit : undefined}
				productsCount={products.length}
				isLoading={isLoading}
				enableSelectMode={selectMode}
				handleSwitchSelectMode={handleSwitchSelectMode}
				handleSwitchDeleteModal={handleSwitchDeleteModal}
			/>

			<TitleContainer>
				<ItemTitle>{storeName}</ItemTitle>
			</TitleContainer>

			<ListProducts
				ref={listProdsRef}
				products={productsSearch}
				isRefreshing={isLoading}
				onRefresh={loadData}
				handleDeleteMany={hasPermission ? handleDeleteMany : undefined}
				setSelectModeOnParent={
					hasPermission ? setSelectMode : undefined
				}
			/>

			<FloatButton
				navigateTo="AddProduct"
				storeId={routeParams.store_id}
			/>
		</Container>
	);
};

export default StoreView;
