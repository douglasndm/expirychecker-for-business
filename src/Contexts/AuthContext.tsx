import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	useMemo,
	createContext,
	ReactNode,
} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import api from '@teams/Services/API/Config';

interface AuthContextData {
	user: FirebaseAuthTypes.User | null;
	token: string | null;
	signed: boolean;
	initializing: boolean;
}

const AuthContext = createContext<Partial<AuthContextData>>({});

interface AuthProviderProps {
	children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [initializing, setInitializing] = useState(true);
	const [isSigned, setIsSigned] = useState<boolean>(false);

	const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

	const onAuthStateChanged = useCallback(
		async (loggedUser: FirebaseAuthTypes.User | null) => {
			if (loggedUser) {
				setUser(loggedUser);
				setIsSigned(true);

				if (!loggedUser.email) {
					throw new Error('Email is required');
				}

				const token = await loggedUser.getIdToken();

				api.defaults.headers.common.Authorization = `Baerer ${token}`;
			} else {
				setIsSigned(false);
				setUser(null);
			}

			setInitializing(false);
		},
		[]
	);

	const onUserChanged = useCallback(
		(changedUser: FirebaseAuthTypes.User | null) => {
			if (changedUser) {
				setUser(changedUser);
			}
		},
		[]
	);

	useEffect(() => {
		const subscriber = auth().onUserChanged(onUserChanged);

		return subscriber;
	}, [onUserChanged]);

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

		return subscriber;
	}, [onAuthStateChanged]);

	const authContextValue = useMemo(
		() => ({ signed: isSigned, user, initializing }),
		[isSigned, user, initializing]
	);

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
};

function useAuth(): Partial<AuthContextData> {
	const context = useContext(AuthContext);

	return context;
}

export { AuthProvider, useAuth };
