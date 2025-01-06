import React, { useState, useCallback, useEffect, memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { Menu } from 'react-native-paper';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { clearSelectedteam } from '@teams/Functions/Team/SelectedTeam';
import { removeItSelfFromTeam } from '@teams/Functions/Team/User/Remove';

import { getCurrentSubscription } from '@teams/Utils/Subscriptions/GetCurrent';
import { getUserTeam } from '@teams/Utils/User/GetTeam';
import { getUserStore } from '@teams/Utils/User/GetStore';

import Loading from '@components/Loading';
import Button from '@components/Button';

import Header from './Header';
import TeamItem from './Team';

import {
	Container,
	Content,
	EmptyText,
	ListTeamsTitle,
	Footer,
} from './styles';

const List: React.FC = () => {
	const { navigate, addListener } =
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

			if (Object.keys(Object(userRole)).length > 0 && userRole) {
				try {
					const teamSubscription = await getCurrentSubscription({
						team_id: userRole.team.id,
					});

					setTeamSub(teamSubscription);
				} catch (error) {
					console.log(error);
					if (error instanceof Error) {
						if (
							!error.message.includes(
								"doesn't have a subscription"
							)
						) {
							// error handler
						}
					}
				}

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

	return (
		<Container>
			<Header
				isLoading={isLoading || isQuiting}
				loadData={loadData}
				handleSettings={handleSettings}
			/>

			{isLoading || isQuiting ? (
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

									<TeamItem
										team={team}
										teamSub={teamSub}
										switchShowMenu={switchShowMenu}
									/>
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
