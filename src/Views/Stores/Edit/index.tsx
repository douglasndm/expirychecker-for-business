import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';
import { updateStore } from '@teams/Functions/Team/Stores/Update';
import { deleteStore } from '@teams/Functions/Team/Stores/Delete';

import Loading from '@components/Loading';
import Header from '@components/Header';
import Dialog from '@components/Dialog';

import {
	Container,
	Content,
	InputTextContainer,
	InputText,
	InputTextTip,
} from './styles';

interface Props {
	store_id: string;
}
const Edit: React.FC = () => {
	const { params } = useRoute();
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [name, setName] = useState<string | undefined>(undefined);
	const [errorName, setErrorName] = useState<string>('');

	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const routeParams = params as Props;

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await getAllStoresFromTeam();

			const store = response.find(sto => sto.id === routeParams.store_id);

			if (store) setName(store.name);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.store_id]);

	useEffect(() => {
		loadData();
	}, []);

	const onNameChange = useCallback((value: string) => {
		setErrorName('');
		setName(value);
	}, []);

	const handleUpdate = useCallback(async () => {
		if (!name) {
			setErrorName(strings.View_Store_Edit_Error_EmtpyName);
			return;
		}

		await updateStore({
			store_id: routeParams.store_id,
			name,
		});

		showMessage({
			message: strings.View_Store_Edit_SuccessText,
			type: 'info',
		});

		reset({
			routes: [
				{ name: 'Home' },
				{
					name: 'StoreList',
				},
			],
		});
	}, [name, routeParams.store_id, reset]);

	const handleDeleteStore = useCallback(async () => {
		try {
			await deleteStore({
				store_id: routeParams.store_id,
			});

			showMessage({
				message: strings.View_Store_Success_OnDelete,
				type: 'info',
			});

			reset({
				routes: [
					{ name: 'Home' },
					{
						name: 'StoreList',
					},
				],
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [reset, routeParams.store_id]);

	const handleSwitchShowDelete = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	return (
		<Container>
			<Header
				title={strings.View_Store_Edit_PageTitle}
				noDrawer
				appBarActions={
					isLoading
						? []
						: [
								{
									icon: 'content-save-outline',
									onPress: handleUpdate,
								},
						  ]
				}
				moreMenuItems={
					isLoading
						? []
						: [
								{
									title: strings.View_ProductDetails_Button_DeleteProduct,
									leadingIcon: 'trash-can-outline',
									onPress: handleSwitchShowDelete,
								},
						  ]
				}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<Content>
					<InputTextContainer hasError={!!errorName}>
						<InputText
							placeholder={
								strings.View_Store_Edit_InputNamePlaceholder
							}
							value={name}
							onChangeText={onNameChange}
						/>
					</InputTextContainer>
					{!!errorName && <InputTextTip>{errorName}</InputTextTip>}
				</Content>
			)}

			<Dialog
				visible={deleteComponentVisible}
				title={strings.View_Store_Edit_DeleteModal_Title}
				description={strings.View_Store_Edit_DeleteModal_Message}
				cancelText={strings.View_Store_Edit_DeleteModal_Cancel}
				confirmText={strings.View_Store_Edit_DeleteModal_Confirm}
				onConfirm={handleDeleteStore}
				onDismiss={handleSwitchShowDelete}
				onCancel={handleSwitchShowDelete}
			/>
		</Container>
	);
};

export default Edit;
