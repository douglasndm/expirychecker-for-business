import React, { useCallback, useMemo, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Drawer } from 'react-native-drawer-layout';

import DrawerContext from '@shared/Contexts/Drawer';

import DrawerMenu from '@teams/Components/DrawerMenu';
import TabMenu from '@components/TabMenu';

// Auth
import Intro from '@teams/Views/Informations/Intro';
import Login from '@teams/Views/Auth/Login';
import ForgotPassword from '@teams/Views/Auth/ForgotPassword';
import CreateAccount from '@teams/Views/Auth/CreateAccount';
// end auth

import Home from '@teams/Views/Home';
import AddProduct from '@teams/Views/Product/Add';
import AddBatch from '@teams/Views/Batch/Add';
import EditProduct from '@teams/Views/Product/Edit';
import EditBatch from '@teams/Views/Batch/Edit';
import ProductDetails from '@teams/Views/Product/Details';
import Settings from '@teams/Views/Settings';
import About from '@teams/Views/About';
import NoInternet from '@views/Information/Errors/NoInternet';
import PhotoView from '@views/Product/PhotoView';

import BatchView from '@teams/Views/Batch/View';
import BatchDiscount from '@teams/Views/Batch/Discount';

import User from '@teams/Views/User';
import Logout from '@teams/Views/Auth/Logout';

import ListCategory from '@teams/Views/Category/List';
import CategoryView from '@teams/Views/Category/View';
import CategoryEdit from '@teams/Views/Category/Edit';

import BrandList from '@teams/Views/Brand/List';
import BrandView from '@teams/Views/Brand/View';
import BrandEdit from '@teams/Views/Brand/Edit';

import StoreList from '@teams/Views/Stores/List';
import StoreView from '@teams/Views/Stores/View';
import StoreEdit from '@teams/Views/Stores/Edit';

import Export from '@teams/Views/Export';

import TeamList from '@teams/Views/Team/List';

// Team management
import EnterTeam from '@teams/Views/Team/EnterTeam';
import CreateTeam from '@teams/Views/Team/Add';
import EditTeam from '@teams/Views/Team/Edit';
import ViewTeam from '@teams/Views/Team/View';
import ListUsers from '@teams/Views/Team/Manager/ListUsers';
import UserDetails from '@teams/Views/Team/Manager/UserDetails';

import Logs from '@teams/Views/Team/Management/Logs';

import VerifyEmail from '@teams/Views/Account/VerifyEmail';

import DeleteTeam from '@teams/Views/Informations/Delete/Team';
import DeleteUser from '@teams/Views/Informations/Delete/User';

import Test from '@teams/Views/Test';

const Stack = createStackNavigator();

const Routes: React.FC = () => {
	const [draweOpen, setDrawerOpen] = useState(false);

	const [currentRoute, setCurrentRoute] = useState('Home');

	const handleRouteChange = useCallback(navRoutes => {
		setDrawerOpen(false);

		if (navRoutes) {
			const { routes } = navRoutes.data.state;
			const route = routes[routes.length - 1].name;

			setCurrentRoute(route);
		}
	}, []);

	const swipeEnabled = useMemo(() => {
		switch (currentRoute) {
			case 'Subscription':
				return false;
			case 'ViewTeam':
				return false;
			case 'CreateTeam':
				return false;
			case 'TeamList':
				return false;
			case 'DeleteTeam':
				return false;
			case 'Settings':
				return false;
			case 'Intro':
				return false;
			case 'Login':
				return false;
			case 'ForgotPassword':
				return false;
			case 'CreateAccount':
				return false;
			default:
				return true;
		}
	}, [currentRoute]);

	const toggleDrawer = useCallback(() => {
		setDrawerOpen(prevState => !prevState);
	}, []);

	const contextValue = useMemo(
		() => ({ setDrawerOpen, toggleDrawer }),
		[setDrawerOpen, toggleDrawer]
	);

	return (
		<Drawer
			open={draweOpen}
			onOpen={() => setDrawerOpen(true)}
			onClose={() => setDrawerOpen(false)}
			renderDrawerContent={() => <DrawerMenu />}
			swipeEnabled={swipeEnabled}
		>
			<DrawerContext.Provider value={contextValue}>
				<Stack.Navigator
					screenOptions={{ headerShown: false }}
					screenListeners={{ state: handleRouteChange }}
				>
					<Stack.Screen name="Intro" component={Intro} />
					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen
						name="ForgotPassword"
						component={ForgotPassword}
					/>
					<Stack.Screen
						name="CreateAccount"
						component={CreateAccount}
					/>

					<Stack.Screen name="Home" component={Home} />
					<Stack.Screen name="AddProduct" component={AddProduct} />

					<Stack.Screen name="Settings" component={Settings} />
					<Stack.Screen name="About" component={About} />
					<Stack.Screen
						name="ProductDetails"
						component={ProductDetails}
					/>
					<Stack.Screen name="AddBatch" component={AddBatch} />
					<Stack.Screen name="EditProduct" component={EditProduct} />
					<Stack.Screen name="EditBatch" component={EditBatch} />
					<Stack.Screen name="PhotoView" component={PhotoView} />

					<Stack.Screen name="BatchView" component={BatchView} />
					<Stack.Screen
						name="BatchDiscount"
						component={BatchDiscount}
					/>

					<Stack.Screen
						name="ListCategory"
						component={ListCategory}
					/>
					<Stack.Screen
						name="CategoryView"
						component={CategoryView}
					/>
					<Stack.Screen
						name="CategoryEdit"
						component={CategoryEdit}
					/>

					<Stack.Screen name="BrandList" component={BrandList} />
					<Stack.Screen name="BrandView" component={BrandView} />
					<Stack.Screen name="BrandEdit" component={BrandEdit} />

					<Stack.Screen name="StoreList" component={StoreList} />
					<Stack.Screen name="StoreView" component={StoreView} />
					<Stack.Screen name="StoreEdit" component={StoreEdit} />

					<Stack.Screen name="User" component={User} />

					<Stack.Screen name="Logout" component={Logout} />

					<Stack.Screen name="Export" component={Export} />

					<Stack.Screen name="TeamList" component={TeamList} />

					<Stack.Screen name="CreateTeam" component={CreateTeam} />
					<Stack.Screen name="EnterTeam" component={EnterTeam} />

					<Stack.Screen name="ViewTeam" component={ViewTeam} />
					<Stack.Screen name="EditTeam" component={EditTeam} />
					<Stack.Screen
						name="ListUsersFromTeam"
						component={ListUsers}
					/>
					<Stack.Screen name="UserDetails" component={UserDetails} />

					<Stack.Screen name="TeamLogs" component={Logs} />

					<Stack.Screen name="DeleteTeam" component={DeleteTeam} />
					<Stack.Screen name="DeleteUser" component={DeleteUser} />

					<Stack.Screen name="VerifyEmail" component={VerifyEmail} />

					<Stack.Screen name="NoInternet" component={NoInternet} />

					<Stack.Screen name="Test" component={Test} />
				</Stack.Navigator>

				<TabMenu
					currentRoute={currentRoute}
					enableMultiplesStores={false}
				/>
			</DrawerContext.Provider>
		</Drawer>
	);
};

export default Routes;
