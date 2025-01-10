import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useContext,
	createContext,
	ReactNode,
} from 'react';

import { captureException } from '@services/ExceptionsHandler';

import {
	getSelectedTeam,
	clearSelectedteam,
} from '@teams/Functions/Team/SelectedTeam';
import { getCurrentSubscription } from '@teams/Utils/Settings/CurrentTeamSubscription';

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
		try {
			const response = await getSelectedTeam();
			const sub = await getCurrentSubscription();

			if (response) {
				const { team, role, status } = response.userRole;

				setName(team.name);
				setRoleInTeam({
					role: role.toLowerCase() as
						| 'repositor'
						| 'supervisor'
						| 'manager',
					status: status,
					store: response.userRole.store,
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
