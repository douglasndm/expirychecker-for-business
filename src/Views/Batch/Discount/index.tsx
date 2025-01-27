import React, { useState, useCallback, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { getLocales } from 'react-native-localize';
import { NumericFormat } from 'react-number-format';

import { captureException } from '@services/ExceptionsHandler';

import { updateBatchDiscount } from '@teams/Functions/Products/Batches/Discount';

import Header from '@components/Header';
import Button from '@components/Button';

import {
	Container,
	Content,
	BatchName,
	BatchPrice,
	SliderContent,
	TempPrice,
	Slider,
	NewPrice,
} from './styles';

interface Params {
	batch: string;
}

const Discount: React.FC = () => {
	const route = useRoute();
	const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

	const routeParams = route.params as Params;

	const [applyingDiscount, setApplyingDiscount] = useState<boolean>(false);
	const [discount, setDiscount] = useState<number>(0);
	const [newPrice, setNewPrice] = useState<number>(0);

	const currencyPrefix = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return '$';
		}

		return 'R$';
	}, []);

	const batch = useMemo(() => {
		if (routeParams.batch) {
			return JSON.parse(routeParams.batch) as IBatch;
		}
		return null;
	}, [routeParams.batch]);

	const handleApplyDiscount = useCallback(async () => {
		if (!batch) {
			return;
		}

		try {
			setApplyingDiscount(true);

			await updateBatchDiscount({
				batch_id: batch.id,
				temp_price: newPrice,
			});

			showMessage({
				message: 'Desconto aplicado!',
				type: 'info',
			});

			pop();
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error });
			}
		} finally {
			setApplyingDiscount(false);
		}
	}, [batch, newPrice, pop]);

	const onSliderChange = useCallback(
		(value: number) => {
			setDiscount(value);

			if (batch && batch.price) {
				const priceAsString = String(batch.price);
				const fullPrice = Number(
					priceAsString.replace(/[^0-9.-]+/g, '')
				);

				const currentDiscount = fullPrice * value;
				setNewPrice(fullPrice - currentDiscount);
			}
		},
		[batch]
	);

	return (
		<Container>
			<Header title="Desconto" noDrawer />

			{!!batch && (
				<Content>
					<BatchName>
						{`Lote: `}
						{batch.name}
					</BatchName>
					<BatchPrice>
						{`Preço atual: `}
						<NumericFormat
							value={batch.price}
							displayType="text"
							thousandSeparator
							prefix={currencyPrefix}
							renderText={value => value}
							decimalScale={2}
						/>
					</BatchPrice>

					<SliderContent>
						<TempPrice>
							Desconto de {Math.round(discount * 100)}%
						</TempPrice>

						<Slider
							minimumValue={0}
							maximumValue={1}
							onValueChange={onSliderChange}
						/>

						<NewPrice>
							{`Preço com desconto: `}
							<NumericFormat
								value={newPrice}
								displayType="text"
								thousandSeparator
								prefix={currencyPrefix}
								renderText={value => value}
								decimalScale={2}
							/>
						</NewPrice>
					</SliderContent>

					<Button
						title="Aplicar desconto"
						onPress={handleApplyDiscount}
						isLoading={applyingDiscount}
					/>
				</Content>
			)}
		</Container>
	);
};

export default Discount;
