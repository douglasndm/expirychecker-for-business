import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { parseISO } from 'date-fns';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import {
	deleteBatch,
	getBatch,
	updateBatch,
} from '@teams/Functions/Products/Batches/Batch';

import Loading from '@components/Loading';
import Header from '@components/Header';
import Dialog from '@components/Dialog';

import ProductBatch from '@views/Product/Add/Components/Inputs/ProductBatch';
import ProductCount from '@views/Product/Add/Components/Inputs/ProductCount';
import BatchPrice from '@views/Product/Add/Components/Inputs/BatchPrice';
import BatchExpDate from '@views/Product/Add/Components/Inputs/BatchExpDate';

import {
	Content,
	PageContent,
	InputContainer,
	InputGroup,
} from '@teams/Views/Product/Add/styles';

import { ProductHeader, ProductName, ProductCode } from '../Add/styles';

import {
	Container,
	ContentHeader,
	RadioButton,
	RadioButtonText,
} from './styles';

interface Props {
	productId: string;
	batchId: string;
}

const EditBatch: React.FC = () => {
	const route = useRoute();
	const { replace } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const routeParams = route.params as Props;

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);

	const userRole = useMemo(() => {
		if (!teamContext.roleInTeam) {
			return null;
		}
		return teamContext.roleInTeam.role.toLowerCase();
	}, [teamContext.roleInTeam]);

	const isSupervisor = useMemo(() => {
		if (userRole === 'manager' || userRole === 'supervisor') {
			return true;
		}
		return false;
	}, [userRole]);

	const productId = useMemo(() => {
		return routeParams.productId;
	}, [routeParams]);

	const batchId = useMemo(() => {
		return routeParams.batchId;
	}, [routeParams]);

	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const [product, setProduct] = useState<IProduct | null>(null);
	const [batch, setBatch] = useState('');
	const [amount, setAmount] = useState<number | null>(null);
	const [price, setPrice] = useState<number | null>(null);

	const [expDate, setExpDate] = useState(new Date());
	const [status, setStatus] = useState<'checked' | 'unchecked'>('unchecked');

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await getBatch({ batch_id: batchId });

			setProduct(response.product);
			setBatch(response.batch.name);
			setStatus(response.batch.status);
			if (response.batch.amount) setAmount(response.batch.amount);

			if (response.batch.price) {
				const p = parseFloat(
					String(response.batch.price).replace(/\$/g, '')
				);

				setPrice(p);
			}
			setExpDate(parseISO(response.batch.exp_date));
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [batchId]);

	const handleUpdate = useCallback(async () => {
		if (batch.trim() === '') {
			Alert.alert(strings.View_EditBatch_Error_EmptyName);
			return;
		}

		try {
			setIsUpdating(true);
			await updateBatch({
				batch: {
					id: batchId,
					name: batch,
					amount: Number(amount),
					exp_date: String(expDate),
					price: price || undefined,
					status,
				},
			});

			showMessage({
				message: strings.View_Success_BatchUpdated,
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
			setIsUpdating(false);
		}
	}, [amount, batch, batchId, expDate, price, productId, replace, status]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleDelete = useCallback(async () => {
		try {
			setIsLoading(true);
			await deleteBatch({ batch_id: batchId });

			showMessage({
				message: strings.View_Success_BatchDeleted,
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
			setIsLoading(false);
		}
	}, [batchId, productId, replace]);

	const switchShowDeleteModal = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	return isLoading || isUpdating ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_EditBatch_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'content-save-outline',
						onPress: handleUpdate,
					},
				]}
				moreMenuItems={
					isSupervisor
						? [
								{
									title: strings.View_ProductDetails_Button_DeleteProduct,
									leadingIcon: 'trash-can-outline',
									onPress: switchShowDeleteModal,
								},
						  ]
						: []
				}
			/>
			<Content>
				<PageContent>
					<InputContainer>
						<ContentHeader>
							<ProductHeader>
								{!!product && (
									<ProductName>{product.name}</ProductName>
								)}
								{!!product && !!product.code && (
									<ProductCode>{product.code}</ProductCode>
								)}
							</ProductHeader>
						</ContentHeader>

						<InputGroup>
							<ProductBatch batch={batch} setBatch={setBatch} />
							<ProductCount
								amount={amount}
								setAmount={setAmount}
							/>
						</InputGroup>

						<BatchPrice price={price} setPrice={setPrice} />

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<RadioButton
									value="checked"
									status={
										status === 'checked'
											? 'checked'
											: 'unchecked'
									}
									onPress={() => setStatus('checked')}
								/>
								<RadioButtonText>
									{strings.View_EditBatch_RadioButton_Treated}
								</RadioButtonText>
							</View>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<RadioButton
									value="unchecked"
									status={
										status !== 'checked'
											? 'checked'
											: 'unchecked'
									}
									onPress={() => setStatus('unchecked')}
								/>
								<RadioButtonText>
									{
										strings.View_EditBatch_RadioButton_NotTreated
									}
								</RadioButtonText>
							</View>
						</View>

						<BatchExpDate
							expDate={expDate}
							setExpDate={setExpDate}
						/>
					</InputContainer>
				</PageContent>
			</Content>
			<Dialog
				title={strings.View_EditBatch_WarningDelete_Title}
				description={strings.View_EditBatch_WarningDelete_Message}
				confirmText={
					strings.View_EditBatch_WarningDelete_Button_Confirm
				}
				cancelText={strings.View_EditBatch_WarningDelete_Button_Cancel}
				visible={deleteComponentVisible}
				onConfirm={handleDelete}
				onDismiss={switchShowDeleteModal}
				onCancel={switchShowDeleteModal}
			/>
		</Container>
	);
};

export default EditBatch;
