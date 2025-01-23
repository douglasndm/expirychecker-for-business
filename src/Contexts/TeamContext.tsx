import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useContext,
	createContext,
	ReactNode,
} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { captureException } from '@services/ExceptionsHandler';

import { getCurrentSubscription } from '@teams/Utils/Settings/CurrentTeamSubscription';
import { IOrganizedInfoResponse } from '@teams/Utils/User/Login/organizedInfo';

import { clearSelectedteam } from '@teams/Functions/Team/SelectedTeam';

interface ITeamContext {
	name: string | null;
	roleInTeam: {
		role: 'repositor' | 'supervisor' | 'manager';
		status: 'pending' | 'completed' | null;
		store: IStore | null;
	} | null;
	subscription: ITeamSubscription | null;
	reload: () => void;
	clearTeam: () => void;
	isLoading: boolean;
}

const TeamContext = createContext<Partial<ITeamContext>>({});

interface TeamProviderProps {
	children: ReactNode;
}

const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
	const [name, setName] = useState<ITeamContext['name']>(null);
	const [subscription, setSubscription] = useState<ITeamSubscription | null>(
		null
	);
	const [roleInTeam, setRoleInTeam] =
		useState<ITeamContext['roleInTeam']>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const reloadTeam = useCallback(async () => {
		const loggedUser = auth().currentUser;
		if (loggedUser === null) return;

		try {
			const data = await AsyncStorage.getItem('userInfo');
			const teamResponse = JSON.parse(
				String(data)
			) as IOrganizedInfoResponse;

			const sub = await getCurrentSubscription();

			if (teamResponse && teamResponse.role) {
				const { team, status, store } = teamResponse.role;
				setName(team.name);
				setRoleInTeam({
					role: teamResponse.role.name,
					status,
					store,
				});
				if (sub) {
					setSubscription(sub);
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				captureException(error, { stack: error.stack });
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		reloadTeam();
	}, []);

	const reload = useCallback(() => {
		setIsLoading(true);
		reloadTeam();
	}, [reloadTeam]);

	const clearTeam = useCallback(async () => {
		Promise.all([
			await clearSelectedteam(),
			setName(null),
			setSubscription(null),
			setRoleInTeam(null),
		]);
	}, []);

	const contextValue = useMemo(
		() => ({
			name,
			subscription,
			roleInTeam,
			reload,
			isLoading,
			clearTeam,
		}),
		[name, subscription, roleInTeam, reload, isLoading, clearTeam]
	);

	return (
		<TeamContext.Provider value={contextValue}>
			{children}
		</TeamContext.Provider>
	);
};

function useTeam(): Partial<ITeamContext> {
	const context = useContext(TeamContext);

	return context;
}

export { TeamProvider, useTeam };
