import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import Clipboard from '@react-native-clipboard/clipboard';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';
import { useAuth } from '@teams/Contexts/AuthContext';

import { removeUserFromTeam } from '@teams/Functions/Team/Users';
import { updateUserRole } from '@teams/Functions/User/Roles';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';
import {
	addUserToStore,
	removeUserFromStore,
} from '@teams/Functions/Team/Stores/User';

import Header from '@components/Header';
import Loading from '@components/Loading';

import {
	Container,
	PageContent,
	UserName,
	UserInfo,
	CodeDetails,
	CodeTitle,
	CodeContainer,
	Code,
	SettingContainer,
	SettingTitle,
	SettingDescription,
	RoleText,
	RadioButtonGroup,
	RadioButtonItem,
} from './styles';

interface UserDetailsProps {
	route: {
		params: {
			user: string;
		};
	};
}

const UserDetails: React.FC<UserDetailsProps> = ({
	route,
}: UserDetailsProps) => {
	const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

	const authContext = useAuth();
	const teamContext = useTeam();

	const user: IUserInTeam = useMemo(() => {
		return JSON.parse(String(route.params.user));
	}, [route.params.user]);

	const isMyself = useMemo(
		() => user.fid === authContext.user?.uid,
		[authContext.user, user.fid]
	);

	const [stores, setStores] = useState<IPickerItem[]>([]);

	const [selectedRole, setSelectedRole] = useState<
		'repositor' | 'supervisor' | 'manager'
	>(() => {
		if (user.role) {
			const role = user.role.toLowerCase();

			if (role === 'manager') {
				return 'manager';
			}
			if (role === 'supervisor') {
				return 'supervisor';
			}
		}
		return 'repositor';
	});

	const [selectedStore, setSelectedStore] = useState<string>(() => {
		if (user.store) {
			return user.store.id;
		}
		return 'noStore';
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const allStores = await getAllStoresFromTeam();

			const storesToAdd: IPickerItem[] = [];
			allStores.forEach(store => {
				storesToAdd.push({
					key: store.id,
					value: store.id,
					label: store.name,
				});
			});

			setStores(storesToAdd);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, []);

	const enableManagerTools = useMemo(() => {
		if (teamContext.roleInTeam) {
			if (teamContext.roleInTeam.role.toLowerCase() === 'manager') {
				return true;
			}
		}
		return false;
	}, [teamContext.roleInTeam]);

	const userIsPending = useMemo(() => {
		if (user.status) {
			if (user.status.toLowerCase() === 'pending') {
				return true;
			}
		}
		return false;
	}, [user.status]);

	const handleCopyCode = useCallback(() => {
		Clipboard.setString(user.code);

		showMessage({
			message: strings.View_UserDetails_Alert_Code_InTransferArea,
			type: 'info',
		});
	}, [user.code]);

	const handleRemoveUser = useCallback(async () => {
		try {
			setIsLoading(true);
			await removeUserFromTeam({
				user_id: user.id,
			});

			showMessage({
				message: strings.View_UserDetails_Alert_User_Removed,
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [pop, user.id]);

	const handleUpdate = useCallback(async () => {
		try {
			setIsLoading(true);
			if (user.store) {
				if (selectedStore === null) {
					await removeUserFromStore({
						store_id: user.store.id,
						user_id: user.id,
					});
				}
			}

			if (selectedStore !== null) {
				if (!user.store || selectedStore !== user.store.id) {
					if (selectedStore.toLowerCase() !== 'nostore') {
						await addUserToStore({
							user_id: user.id,
							store_id: selectedStore,
						});
					}
				}
			}

			await updateUserRole({
				user_id: user.id,
				newRole: selectedRole,
			});

			showMessage({
				message: strings.View_UserDetails_Alert_User_Updated,
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [pop, selectedRole, selectedStore, user]);

	useEffect(() => {
		loadData();
	}, []);

	const enableManager = useMemo(() => {
		if (enableManagerTools && authContext.user && !isMyself) {
			return true;
		}
		return false;
	}, [authContext.user, enableManagerTools, isMyself]);

	const handleOnRoleChange = useCallback((value: string) => {
		if (value.toLowerCase() === 'supervisor') {
			setSelectedRole('supervisor');
			return;
		}

		setSelectedRole('repositor');
	}, []);

	const handleOnStoreChange = useCallback((value: string) => {
		setSelectedStore(value);
	}, []);

	const appBarActions = useMemo(() => {
		if (enableManager && !isLoading) {
			return [
				{
					icon: 'content-save-outline',
					onPress: handleUpdate,
				},
			];
		}
		return [];
	}, [enableManager, handleUpdate, isLoading]);

	const moreMenuItems = useMemo(() => {
		if (enableManager && !isLoading) {
			return [
				{
					title: strings.View_UserDetails_Action_RemoverUser,
					leadingIcon: 'account-minus-outline',
					onPress: handleRemoveUser,
				},
			];
		}

		return [];
	}, [enableManager, handleRemoveUser, isLoading]);

	return (
		<Container>
			<Header
				title={strings.View_UserDetails_PageTitle}
				noDrawer
				appBarActions={appBarActions}
				moreMenuItems={moreMenuItems}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<ScrollView>
					<PageContent>
						{!!user.name && !!user.lastName && (
							<UserName>{`${user.name} ${user.lastName}`}</UserName>
						)}

						<UserInfo>{user.email}</UserInfo>

						{userIsPending && enableManagerTools && (
							<CodeDetails>
								<CodeTitle>
									{strings.View_UserDetails_Code_Title}
								</CodeTitle>
								<CodeContainer onPress={handleCopyCode}>
									<Code>{user.code}</Code>
								</CodeContainer>
							</CodeDetails>
						)}

						{enableManagerTools &&
							authContext.user &&
							!isMyself &&
							!userIsPending && (
								<>
									<SettingContainer>
										<SettingTitle>
											{
												strings.View_UserDetails_Setting_UserRole_Title
											}
										</SettingTitle>

										<SettingDescription>
											{
												strings.View_UserDetails_Setting_UserRole_Description
											}
										</SettingDescription>

										<SettingDescription>
											<RoleText>
												{
													strings.View_UserDetails_Setting_UserRole_Repositor
												}
											</RoleText>
											:{' '}
											{
												strings.View_UserDetails_Setting_UserRole_Description_Repositor
											}
										</SettingDescription>
										<SettingDescription>
											<RoleText>
												{
													strings.View_UserDetails_Setting_UserRole_Supervisor
												}
											</RoleText>
											:{' '}
											{
												strings.View_UserDetails_Setting_UserRole_Description_Supervisor
											}
										</SettingDescription>

										<RadioButtonGroup
											onValueChange={handleOnRoleChange}
											value={selectedRole}
										>
											<RadioButtonItem
												label={
													strings.View_UserDetails_Setting_UserRole_Repositor
												}
												value="repositor"
											/>
											<RadioButtonItem
												label={
													strings.View_UserDetails_Setting_UserRole_Supervisor
												}
												value="supervisor"
											/>
										</RadioButtonGroup>
									</SettingContainer>

									<SettingContainer>
										<SettingTitle>
											{
												strings.View_UserDetails_Setting_UserStore_Title
											}
										</SettingTitle>

										<SettingDescription>
											{
												strings.View_UserDetails_Setting_UserStore_Description
											}
										</SettingDescription>

										<RadioButtonGroup
											onValueChange={handleOnStoreChange}
											value={selectedStore}
										>
											<RadioButtonItem
												value="noStore"
												label={
													strings.View_UserDetails_Setting_UserStore_NoStore
												}
											/>

											{stores.map(store => (
												<RadioButtonItem
													key={store.key}
													value={store.value}
													label={store.label}
												/>
											))}
										</RadioButtonGroup>
									</SettingContainer>
								</>
							)}
					</PageContent>
				</ScrollView>
			)}
		</Container>
	);
};

export default UserDetails;
