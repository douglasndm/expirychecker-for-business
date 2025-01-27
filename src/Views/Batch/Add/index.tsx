import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { getProduct } from '@teams/Functions/Products/Product';
import { createBatch } from '@teams/Functions/Products/Batches/Batch';

import Loading from '@components/Loading';
import Header from '@components/Header';

import ProductBatch from '@views/Product/Add/Components/Inputs/ProductBatch';
import ProductCount from '@views/Product/Add/Components/Inputs/ProductCount';
import BatchPrice from '@views/Product/Add/Components/Inputs/BatchPrice';
import BatchExpDate from '@views/Product/Add/Components/Inputs/BatchExpDate';

import { InputContainer, InputGroup } from '@teams/Views/Product/Add/styles';

import {
	PageContainer,
	PageContent,
	ProductHeader,
	ProductName,
	ProductCode,
} from './styles';

type ScreenProps = StackScreenProps<RoutesParams, 'AddBatch'>;

const AddBatch: React.FC<ScreenProps> = ({ route }) => {
	const { productId } = route.params;

	const { replace } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [lote, setLote] = useState('');
	const [amount, setAmount] = useState<number | null>(null);
	const [price, setPrice] = useState<number | null>(null);

	const [expDate, setExpDate] = useState(new Date());

	const handleSave = useCallback(async () => {
		if (lote.trim() === '') {
			showMessage({
				message: strings.View_AddBatch_Error_EmptyName,
				type: 'danger',
			});
			return;
		}
		try {
			setIsAdding(true);
			await createBatch({
				productId,
				batch: {
					name: lote,
					amount: Number(amount),
					exp_date: String(expDate),
					price: price || undefined,
					status: 'unchecked',
				},
			});

			showMessage({
				message: strings.View_Success_BatchCreated,
				type: 'info',
			});

			replace('ProductDetails', {
				id: productId,
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsAdding(false);
		}
	}, [lote, productId, amount, expDate, price, replace]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const prod = await getProduct({
				productId,
			});

			if (prod) {
				setName(prod.name);

				if (prod.code) setCode(prod.code);
			}
		} finally {
			setIsLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<PageContainer>
			<Header
				title={strings.View_AddBatch_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'content-save-outline',
						onPress: handleSave,
						disabled: isAdding || isLoading,
					},
				]}
			/>
			{isLoading || isAdding ? (
				<Loading />
			) : (
				<PageContent>
					<InputContainer>
						<ProductHeader>
							<ProductName>{name}</ProductName>
							<ProductCode>{code}</ProductCode>
						</ProductHeader>

						<InputGroup>
							<ProductBatch batch={lote} setBatch={setLote} />
							<ProductCount
								amount={amount}
								setAmount={setAmount}
							/>
						</InputGroup>

						<BatchPrice price={price} setPrice={setPrice} />
						<BatchExpDate
							expDate={expDate}
							setExpDate={setExpDate}
						/>
					</InputContainer>
				</PageContent>
			)}
		</PageContainer>
	);
};

export default AddBatch;
