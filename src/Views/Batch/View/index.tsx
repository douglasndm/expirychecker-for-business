import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import Share from 'react-native-share';
import {  format, parseISO } from 'date-fns';//eslint-disable-line
import { ptBR, enUS } from 'date-fns/locale' // eslint-disable-line
import { NumericFormat } from 'react-number-format';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { sendBatchNotification } from '@teams/Functions/Notifications/Batch';

import Header from '@components/Header';
import Button from '@components/Button';

import {
	Container,
	BatchContainer,
	BatchTitle,
	BatchExpDate,
	BatchAmount,
	BatchPrice,
	BatchInfo,
	ExtraInfoContainer,
	ButtonsCointaner,
} from './styles';

interface Props {
	product: string;
	batch: string;
}

const View: React.FC = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const routeParams = params as Props;

	const [isSendingNotification, setIsSendingNotification] = useState(false);
	const [isSharing, setIsSharing] = useState<boolean>(false);

	const prod = useMemo(() => {
		return JSON.parse(routeParams.product) as IProduct;
	}, [routeParams.product]);

	const userRole = useMemo(() => {
		if (teamContext.roleInTeam) {
			return teamContext.roleInTeam.role.toLowerCase();
		}
		return 'repositor';
	}, [teamContext.roleInTeam]);

	const languageCode = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return enUS;
		}
		return ptBR;
	}, []);

	const dateFormat = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'MM/dd/yyyy';
		}
		return 'dd/MM/yyyy';
	}, []);
	const currencyPrefix = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return '$';
		}

		return 'R$';
	}, []);

	const batch = useMemo(() => {
		return JSON.parse(routeParams.batch) as IBatch;
	}, [routeParams.batch]);

	const created_at = useMemo(() => {
		if (batch.created_at) {
			return format(parseISO(batch.created_at), dateFormat, {});
		}
		return null;
	}, [dateFormat, batch]);
	const updated_at = useMemo(() => {
		if (batch.updated_at) {
			return format(parseISO(batch.updated_at), dateFormat, {});
		}
		return null;
	}, [dateFormat, batch]);

	const handleNaviEdit = useCallback(() => {
		if (batch) {
			navigate('EditBatch', {
				productId: prod.id,
				batchId: batch.id,
			});
		}
	}, [batch, navigate, prod.id]);

	const handleSendNotification = useCallback(async () => {
		try {
			setIsSendingNotification(true);

			if (!batch) {
				return;
			}

			await sendBatchNotification({ batch_id: batch.id });

			showMessage({
				message: 'Notificação enviada',
				description: 'O time será avisado sobre o lote',
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsSendingNotification(false);
		}
	}, [batch]);

	const handleShare = useCallback(async () => {
		try {
			setIsSharing(true);

			const expireDate = format(parseISO(batch.exp_date), dateFormat);

			let text = '';

			if (!!batch.amount && batch.amount > 0) {
				text = strings.View_ShareProduct_MessageWithAmount.replace(
					'{PRODUCT}',
					prod.name
				)
					.replace('{AMOUNT}', String(batch.amount))
					.replace('{DATE}', expireDate);
			} else {
				text = strings.View_ShareProduct_Message.replace(
					'{PRODUCT}',
					prod.name
				).replace('{DATE}', expireDate);
			}

			await Share.open({
				title: strings.View_ShareProduct_Title,
				message: text,
			});
		} catch (err) {
			if (err instanceof Error)
				if (err.message !== 'User did not share') {
					showMessage({
						message: err.message,
						type: 'danger',
					});
				}
		} finally {
			setIsSharing(false);
		}
	}, [batch.exp_date, batch.amount, dateFormat, prod.name]);

	const handleNavigateToDiscount = useCallback(() => {
		navigate('BatchDiscount', {
			batch: JSON.stringify(batch),
		});
	}, [batch, navigate]);

	return (
		<Container>
			<Header
				title="Lote"
				noDrawer
				appBarActions={[
					{
						icon: 'square-edit-outline',
						onPress: handleNaviEdit,
					},
				]}
			/>

			{!!batch && (
				<BatchContainer>
					<BatchTitle>{batch.name}</BatchTitle>

					<BatchExpDate>
						{`Vence em ${format(
							parseISO(batch.exp_date),
							dateFormat,
							{
								locale: languageCode,
							}
						)}`}
					</BatchExpDate>

					{!!batch.amount && (
						<BatchAmount>Quantidade {batch.amount}</BatchAmount>
					)}

					{!!batch.price && (
						<BatchPrice>
							{`Preço unitário `}
							<NumericFormat
								value={batch.price}
								displayType="text"
								thousandSeparator
								prefix={currencyPrefix}
								renderText={value => value}
								decimalScale={2}
							/>
						</BatchPrice>
					)}

					{!!batch.price_tmp && (
						<BatchPrice>
							{`Preço temporário `}
							<NumericFormat
								value={batch.price_tmp}
								displayType="text"
								thousandSeparator
								prefix={currencyPrefix}
								renderText={value => value}
								decimalScale={2}
							/>
						</BatchPrice>
					)}

					<ExtraInfoContainer>
						{created_at && (
							<BatchInfo>{`Adicionado em ${created_at}`}</BatchInfo>
						)}
						{updated_at && (
							<BatchInfo>{`Última vez atualizado em ${updated_at}`}</BatchInfo>
						)}
					</ExtraInfoContainer>

					<ButtonsCointaner>
						{(userRole === 'manager' ||
							userRole === 'supervisor') && (
							<Button
								title="Enviar notificação para o time"
								onPress={handleSendNotification}
								isLoading={isSendingNotification}
								contentStyle={{ width: 250 }}
							/>
						)}

						<Button
							title="Compartilhar com outros apps"
							onPress={handleShare}
							isLoading={isSharing}
							contentStyle={{ marginTop: -5, width: 250 }}
						/>

						{!!batch.price && (
							<Button
								title="Adicionar desconto"
								onPress={handleNavigateToDiscount}
								contentStyle={{ marginTop: -5, width: 250 }}
							/>
						)}
					</ButtonsCointaner>
				</BatchContainer>
			)}
		</Container>
	);
};

export default View;
