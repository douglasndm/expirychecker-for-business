import { destroySession } from '@teams/Functions/Auth/Session';

import strings from '@teams/Locales';

import { reset } from '@teams/References/Navigation';

import { clearSelectedteam } from '@teams/Functions/Team/SelectedTeam';
import { clearCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

import AppError from '@teams/Errors/AppError';

async function errorsHandler(error: any): Promise<void> {
	let err = '';
	let code: number | undefined;

	if (error.response) {
		// Request made and server responded

		// console.log(error.response.data);
		// console.log(error.response.status);
		// console.log(error.response.headers);

		if (error.response.data.errorCode) {
			const { errorCode } = error.response.data;
			const { message } = error.response.data;

			if (message) {
				err = message;
			}

			code = Number(errorCode);
			const result = Object.entries(strings);

			const filted = result.filter(value =>
				value[0].startsWith('API_Error_Code')
			);

			const errString = filted.find(
				value => value[0] === `API_Error_Code${errorCode}`
			);

			switch (errorCode) {
				case 3:
					reset({
						routesNames: ['Logout'],
					});
					break;

				case 7:
					// User was not found
					reset({
						routesNames: ['Logout'],
					});
					break;

				case 17:
					// User is not in team
					// could be removed or manager deleted the team
					await clearSelectedteam();
					await clearCurrentTeam();
					reset({
						routesNames: ['TeamList'],
					});
					break;

				case 22:
					// Device not allowed, login anywhere else
					await destroySession();
					reset({
						routeHandler: 'Auth',
						routesNames: ['Login'],
					});

					break;

				default:
					if (error.response.data.message) {
						err = message;
					}
					break;
			}

			if (errString) {
				err = errString[1];
			}
		} else if (error.response.data.message) {
			err = error.response.data.message;
		}

		if (error.response.status && error.response.status === 403) {
			await destroySession();
		}
	} else if (error.request) {
		err = 'Falha ao tentar se conectar ao servidor';

		console.log('The request was made but no response was received');
		console.error(error.request);
	}

	if (!!err && err !== '') {
		throw new AppError({
			message: err,
			errorCode: code,
		});
	} else if (error instanceof Error) {
		throw new Error(error.message);
	} else {
		Promise.reject(error);
	}
}

export default errorsHandler;
