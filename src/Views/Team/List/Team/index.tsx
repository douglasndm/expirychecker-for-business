import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { isPast } from 'date-fns';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { setCurrentTeam } from '@teams/Utils/Team/CurrentTeam';
import { setCurrentTeamSubscription } from '@teams/Utils/Settings/CurrentTeamSubscription';

import { getTeamPreferences } from '@teams/Functions/Team/Preferences';

import { TeamItemContainer, TeamItemTitle, TeamItemRole } from './styles';
import { getLocalizedRole } from '@teams/Utils/Team/Roles/getLocalizedRole';
import { setTeamPreferences } from '@teams/Utils/Team/Preferences';

interface Props {
	team: IUserRoles | null;
	teamSub: ITeamSubscription | null;
	switchShowMenu: () => void;
}

const Team: React.FC<Props> = (props: Props) => {
	const { team, teamSub, switchShowMenu } = props;

	const { navigate, reset } =
		useNavigation<StackNavigationProp<RoutesParams>>();
	const teamContext = useTeam();

	const role = useMemo(() => {
		return getLocalizedRole(team?.role || '').toLowerCase();
	}, [team]);

	const status = useMemo(() => {
		if (team) {
			if (role === 'manager') {
				return 'completed';
			}
			if (!!team.status) {
				return team.status.toLowerCase();
			}
		}

		return 'pending';
	}, [role, team]);

	const isActive = useMemo(() => {
		if (teamSub) {
			const expDate = teamSub.expireIn;

			return !isPast(expDate);
		}

		return false;
	}, [teamSub]);

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

	const handleSelectTeam = useCallback(async () => {
		if (!team) return;

		if (isActive !== true) {
			if (role !== 'manager' && status === 'pending') {
				navigate('EnterTeam', { userRole: team });
				return;
			} else if (role !== 'manager') {
				showMessage({
					message:
						strings.View_TeamList_Error_ManagerShouldActiveTeam,
					type: 'warning',
				});
				return;
			}
		}

		if (team.team) {
			const teamPreferences = await getTeamPreferences({
				team_id: team.team.id,
			});

			await setCurrentTeam(team.team);
			await setTeamPreferences(teamPreferences);

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

	return (
		<TeamItemContainer
			isPending={isPending || !isActive}
			onPress={handleSelectTeam}
			onLongPress={switchShowMenu}
		>
			<TeamItemTitle>{team?.team.name || ''}</TeamItemTitle>
			<TeamItemRole>
				{isPending ? status.toUpperCase() : role.toUpperCase()}
			</TeamItemRole>
		</TeamItemContainer>
	);
};

export default Team;
