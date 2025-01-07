import auth from '@react-native-firebase/auth';

import api from '@services/API';

import errorsHandler from './Errors';

api.interceptors.request.use(async config => {
	const userToken = await auth().currentUser?.getIdToken();

	if (userToken) {
		config.headers.Authorization = `Bearer ${userToken}`;
	}

	return config;
});

api.interceptors.response.use(response => response, errorsHandler);

export default api;
