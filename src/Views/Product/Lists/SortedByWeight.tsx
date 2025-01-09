import React, { useCallback } from 'react';

import strings from '@shared/Locales';

import { extractProductWeight } from '@utils/Product/Sort/Helpers';

import { getAllProducts } from '@teams/Functions/Products/Products';
import { getAllBrands } from '@teams/Functions/Brand';
import { getAllCategoriesFromTeam } from '@teams/Functions/Categories';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';

import ListProducts from '@views/Product/List';

const SortedByWeight: React.FC = () => {
	const loadProducts = useCallback(async () => {
		const products = await getAllProducts({});

		const filtedProducts = extractProductWeight(products);

		return filtedProducts;
	}, []);

	return (
		<ListProducts
			pageTitle={strings.View_List_Products_SortedByWeight}
			getProducts={loadProducts}
			getAllBrands={getAllBrands}
			getAllCategories={getAllCategoriesFromTeam}
			getAllStores={getAllStoresFromTeam}
		/>
	);
};

export default SortedByWeight;
