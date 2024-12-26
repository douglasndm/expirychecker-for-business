import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { Menu } from 'react-native-paper';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import {
	clearSelectedteam,
	setSelectedTeam,
} from '@teams/Functions/Team/SelectedTeam';
import { getTeamPreferences } from '@teams/Functions/Team/Preferences';
import { removeItSelfFromTeam } from '@teams/Functions/Team/User/Remove';
import { getUser } from '@teams/Functions/User/List';

import { setCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';
import { setCurrentTeamSubscription } from '@teams/Utils/Settings/CurrentTeamSubscription';
import { getCurrentSubscription } from '@teams/Utils/Subscriptions/GetCurrent';
import { getUserTeam } from '@teams/Utils/User/GetTeam';
import { getUserStore } from '@teams/Utils/User/GetStore';

import Loading from '@components/Loading';
import Button from '@components/Button';
import Header from '@components/Header';

import {
	Container,
	Content,
	EmptyText,
	ListTeamsTitle,
	TeamItemContainer,
	TeamItemTitle,
	TeamItemRole,
	Footer,
} from './styles';
import { isPast } from 'date-fns';

const List: React.FC = () => {
	const { navigate, reset, addListener } =
		useNavigation<StackNavigationProp<RoutesParams>>();
	const teamContext = useTeam();

	const [isLoading, setIsLoading] = useState(false);

	const [showMenu, setShowMenu] = useState(false);
	const [isQuiting, setIsQuiting] = useState(false);

	const [team, setTeam] = useState<IUserRoles | null>(null);
	const [teamSub, setTeamSub] = useState<ITeamSubscription | null>(null);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const userRole = await getUserTeam();

			if (userRole) {
				const teamSubscription = await getCurrentSubscription({
					team_id: userRole.team.id,
				});

				setTeamSub(teamSubscription);

				const userStore = await getUserStore();

				if (userStore) {
					setTeam({
						...userRole,
						store: userStore,
					});
				} else {
					setTeam({
						...userRole,
						store: null,
					});
				}
			}
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const role = useMemo(() => {
		if (team && team.role) {
			const userRole = team.role.toLowerCase();

			if (userRole === 'manager') {
				return strings.UserInfo_Role_Manager.toLowerCase();
			}
			if (userRole === 'supervisor') {
				return strings.UserInfo_Role_Supervisor.toLowerCase();
			}
			if (userRole === 'repositor') {
				return strings.UserInfo_Role_Repositor.toLowerCase();
			}
		}

		return strings.UserInfo_Role_Repositor.toLowerCase();
	}, [team]);

	const status = useMemo(() => {
		if (team) {
			if (team.role.toLowerCase() === 'manager') {
				return 'completed';
			}
			if (!!team.status) {
				return team.status.toLowerCase();
			}
		}

		return 'pending';
	}, [team]);

	const isPending = useMemo(() => {
		if (team) {
			if (status) {
				if (status === 'completed') {
					return false;
				}
			}

			if (role && role === 'manager') {
				return false;
			}
		}

		return true;
	}, [role, status, team]);

	const isActive = useMemo(() => {
		if (teamSub) {
			const expDate = teamSub.expireIn;

			return !isPast(expDate);
		}

		return false;
	}, [teamSub]);

	const handleNavigateCreateTeam = useCallback(() => {
		navigate('CreateTeam');
	}, [navigate]);

	const handleSettings = useCallback(() => {
		navigate('Settings');
	}, [navigate]);

	useEffect(() => {
		const unsubscribe = addListener('focus', loadData);

		return unsubscribe;
	}, [addListener, loadData]);

	const handleSelectTeam = useCallback(async () => {
		if (!team) return;

		if (isActive !== true) {
			if (role !== 'manager') {
				showMessage({
					message:
						strings.View_TeamList_Error_ManagerShouldActiveTeam,
					type: 'warning',
				});
				return;
			}
		}

		if (team.team) {
			if (role !== 'manager' && status === 'pending') {
				navigate('EnterTeam', { userRole: team });
				return;
			}

			const teamPreferences = await getTeamPreferences({
				team_id: team.team.id,
			});

			const userResponse = await getUser();

			await setSelectedTeam({
				userRole: {
					...team,
					store: userResponse.store,
				},
				teamPreferences,
			});
			await setCurrentTeam(team.team);

			if (teamSub) {
				await setCurrentTeamSubscription(teamSub);
			}

			if (teamContext.reload) {
				teamContext.reload();
			} else {
				return;
			}

			reset({
				routes: [
					{
						name: 'Home',
					},
				],
			});
		}
	}, [isActive, navigate, reset, role, status, team, teamContext, teamSub]);

	const switchShowMenu = useCallback(() => {
		setShowMenu(prevValue => {
			if (team?.role.toLowerCase() === 'manager') return false;

			return !prevValue;
		});
	}, [team]);

	const quitTeam = useCallback(async () => {
		if (!team) return;

		try {
			setIsQuiting(true);
			await removeItSelfFromTeam({ team_id: team.team.id });

			if (teamContext.clearTeam) {
				teamContext.clearTeam();
			}
			await clearSelectedteam();
			setTeam(null);
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					type: 'danger',
					message: err.message,
				});
			}
		} finally {
			setIsQuiting(false);
		}
	}, [team, teamContext]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_TeamList_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'update',
						onPress: loadData,
						disabled: isLoading,
					},
				]}
				moreMenuItems={[
					{
						title: strings.View_TeamList_Button_Settings,
						onPress: handleSettings,
						leadingIcon: 'cog',
					},
				]}
			/>

			{isQuiting ? (
				<Loading />
			) : (
				<Content>
					{!team && (
						<EmptyText>
							{strings.View_TeamList_EmptyTeamList}
						</EmptyText>
					)}

					{team && (
						<Menu
							visible={showMenu}
							onDismiss={switchShowMenu}
							anchorPosition="bottom"
							anchor={
								<>
									<ListTeamsTitle>
										{strings.View_TeamList_ListTitle}
									</ListTeamsTitle>
									<TeamItemContainer
										isPending={isPending || !isActive}
										onPress={handleSelectTeam}
										onLongPress={switchShowMenu}
									>
										<TeamItemTitle>
											{team?.team.name || ''}
										</TeamItemTitle>
										<TeamItemRole>
											{isPending
												? status.toUpperCase()
												: role.toUpperCase()}
										</TeamItemRole>
									</TeamItemContainer>
								</>
							}
						>
							<Menu.Item
								title={strings.View_TeamView_Button_QuitTeam}
								onPress={quitTeam}
							/>
						</Menu>
					)}
				</Content>
			)}

			<Footer>
				{!team && (
					<Button
						title={strings.View_TeamList_Button_CreateTeam}
						onPress={handleNavigateCreateTeam}
					/>
				)}
			</Footer>
		</Container>
	);
};

export default memo(List);
