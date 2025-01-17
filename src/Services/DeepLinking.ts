import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<RoutesParams> = {
	prefixes: ['expiryteams://'],
	config: {
		screens: {
			About: 'about',
			ProductDetails: 'product/:id',
		},
	},
};

export default linking;
