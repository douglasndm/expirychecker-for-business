import React, {
	useCallback,
	useEffect,
	useState,
	useMemo,
	useRef,
} from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import Analytics from '@react-native-firebase/analytics';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { exportToExcel } from '@utils/Excel/Export';
import { searchProducts } from '@utils/Product/Search';

import {
	deleteManyProducts,
	getAllProducts,
} from '@teams/Functions/Products/Products';
import { getAllProductsFromCategory } from '@teams/Functions/Categories/Products';
import { getAllCategoriesFromTeam } from '@teams/Functions/Categories';
import { getAllBrands } from '@teams/Functions/Brand';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';

import HomeComponent from '@views/Home';
import ListProds from '@components/Product/List';
import FloatButton from '@components/FloatButton';

import {
	Container,
	ItemTitle,
	TitleContainer,
} from '@styles/Views/GenericViewPage';

interface Props {
	id: string;
	category_name?: string;
}

const CategoryView: React.FC = () => {
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

	const categoryName = useMemo(() => {
		if (routeParams.category_name) {
			return routeParams.category_name;
		}
		return '';
	}, [routeParams.category_name]);

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

	const [products, setProducts] = useState<IProduct[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const prods = await getAllProductsFromCategory({
				category_id: routeParams.id,
			});

			setProducts(prods.products);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.id]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleEdit = useCallback(() => {
		navigate('CategoryEdit', { id: routeParams.id });
	}, [navigate, routeParams.id]);

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
				category: routeParams.id,
				getProducts,
				getBrands,
				getCategories,
				getStores,
			});
			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_CategoryView');
			showMessage({
				message: strings.View_Category_View_ExcelExportedSuccess,
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
	}, [routeParams.id]);

	useEffect(() => {
		loadData();
	}, [loadData]);

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
				title={strings.View_Category_List_View_BeforeCategoryName}
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
				<ItemTitle>{categoryName}</ItemTitle>
			</TitleContainer>

			<ListProds
				ref={listProdsRef}
				products={productsSearch}
				isRefreshing={isLoading}
				onRefresh={loadData}
				handleDeleteMany={hasPermission ? handleDeleteMany : undefined}
				setSelectModeOnParent={
					hasPermission ? setSelectMode : undefined
				}
			/>

			<FloatButton navigateTo="AddProduct" categoryId={routeParams.id} />
		</Container>
	);
};

export default CategoryView;
