import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	memo,
	useMemo,
	useContext,
} from 'react';
import BootSplash from 'react-native-bootsplash';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format, isValid, parseISO } from 'date-fns';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '@teams/Contexts/TeamContext';
import PreferencesContext from '@teams/Contexts/PreferencesContext';

import AppError from '@shared/Errors/AppError';
import {
	deleteManyProducts,
	getAllProducts,
	searchProducts as getSearchProducts,
} from '@teams/Functions/Products/Products';

import ListProds from '@components/Product/List';

import HomeComponent from '@views/Home';
import { Container } from '@views/Home/styles';

const Home: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();
	const { preferences } = useContext(PreferencesContext);

	interface listProdsRefProps {
		switchDeleteModal: () => void;
		switchSelectMode: () => void;
	}

	const listRef = useRef<FlatList<IProduct>>(null);
	const listProdsRef = useRef<listProdsRefProps>();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [searchString, setSearchString] = useState<string>('');

	const [selectMode, setSelectMode] = useState(false);

	const [products, setProducts] = useState<Array<IProduct>>([]);
	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);

	const loadProducts = useCallback(async (): Promise<IProduct[]> => {
		try {
			const productsResponse = await getAllProducts({
				removeCheckedBatches: false,
			});

			return productsResponse;
		} catch (error) {
			if (error instanceof AppError) {
				showMessage({
					message: error.message,
					type: 'danger',
				});
				if (error.errorCode === 5) {
					reset({
						routes: [{ name: 'ViewTeam' }],
					});
				}
			}
			if (error instanceof Error)
				showMessage({
					message: error.message,
					type: 'danger',
				});
		}

		return [];
	}, [reset]);

	const hasPermission = useMemo(() => {
		if (!teamContext.roleInTeam) return false;

		const { role } = teamContext.roleInTeam;

		if (role.toLowerCase() === 'manager') return true;
		if (role.toLowerCase() === 'supervisor') return true;
		return false;
	}, [teamContext.roleInTeam]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const initialLoad = useCallback(async () => {
		try {
			setIsLoading(true);

			const prods = await loadProducts();

			setProducts(prods);
		} finally {
			setIsLoading(false);
			await BootSplash.hide({ fade: true });
		}
	}, [loadProducts]);

	useEffect(() => {
		initialLoad();
	}, []);

	const handleDeleteMany = useCallback(
		async (idsToDelete: string[] | number[]) => {
			if (idsToDelete.length <= 0) return;

			try {
				const ids = idsToDelete.map(id => String(id));

				await deleteManyProducts({
					productsIds: ids,
				});

				await initialLoad();
			} catch (err) {
				if (err instanceof Error)
					showMessage({
						message: err.message,
						type: 'danger',
					});
			}
		},
		[initialLoad]
	);

	const handleSearch = useCallback(async (query?: string) => {
		if (!query) return;
		setSearchString(query);

		if (query.trim() !== '') {
			const arrayDate = query.split('/');
			const maybeDate = parseISO(
				`${arrayDate[2]}-${arrayDate[1]}-${arrayDate[0]}`
			);
			const isValidDate = isValid(maybeDate);

			let search = query.trim();

			if (isValidDate) {
				search = format(maybeDate, 'yyyy-MM-dd');
			}

			const response = await getSearchProducts({
				query: search,
			});

			setProductsSearch(response);
		}
	}, []);

	const onSearchChange = useCallback(
		async (q: string) => {
			setSearchString(q);

			if (q.trim() === '') {
				await initialLoad();
			}
		},
		[initialLoad]
	);

	const title = useMemo(() => {
		if (teamContext.roleInTeam?.store?.name) {
			return teamContext.roleInTeam.store.name;
		}
		if (teamContext.name) {
			return teamContext.name;
		}
		return '';
	}, [teamContext]);

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
				title={title}
				productsListRef={listRef}
				searchFor={handleSearch}
				productsCount={products.length}
				onSearch={handleSearch}
				onSearchTextChange={onSearchChange}
				searchValue={searchString}
				enableSelectMode={selectMode}
				enableCheckEmail
				handleSwitchSelectMode={handleSwitchSelectMode}
				handleSwitchDeleteModal={handleSwitchDeleteModal}
				enableCalendar
			/>

			<ListProds
				ref={listProdsRef}
				products={productsSearch}
				listRef={listRef}
				handleDeleteMany={hasPermission ? handleDeleteMany : undefined}
				isRefreshing={isLoading}
				onRefresh={initialLoad}
				setSelectModeOnParent={
					hasPermission ? setSelectMode : undefined
				}
				daysToBeNext={preferences?.howManyDaysToBeNextToExpire}
				disableImage={false}
			/>
		</Container>
	);
};

export default memo(Home);
