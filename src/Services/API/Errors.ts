import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import navigationRef from '@teams/References/Navigation';

import { captureException } from '@services/ExceptionsHandler';

import { destroySession } from '@teams/Utils/Auth/Session';

import { clearSelectedteam } from '@teams/Functions/Team/SelectedTeam';

import AppError from '@shared/Errors/AppError';

function launchAppError(err: string, statusCode?: number, errorCode?: number) {
	showMessage({
		message: err,
		type: 'danger',
	});

	throw new AppError({
		message: err,
		statusCode: statusCode,
		internalErrorCode: errorCode,
	});
}

async function errorsHandler(error: any): Promise<void> {
	if (axios.isAxiosError(error)) {
		const { errorCode, message } = error.response?.data;

		if (message) {
			// this is likely a yup error and maybe is a validation error
			// so we will capture this for improve errors handlers
			if (message.includes('must be a')) {
				captureException({
					error: new Error(message),
					customData: {
						url: error.config?.url,
						method: error.config?.method,
						data: error.config?.data,
					},
				});
			}
		}

		if (errorCode) {
			const result = Object.entries(strings);

			const filted = result.filter(value =>
				value[0].startsWith('API_Error_Code')
			);

			const errString = filted.find(
				value => value[0] === `API_Error_Code${errorCode}`
			);

			if (errString) {
				showMessage({
					message: errString[1],
					type: 'danger',
				});
			}
		}
	}

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
				case 3: // Should make login again
					navigationRef.reset('Logout');
					break;

				case 7: // User was not found
					navigationRef.reset('Logout');
					break;

				case 17: // User is not in team (could be removed or manager deleted the team)
					await clearSelectedteam();
					navigationRef.reset('TeamList');

					break;

				case 22: // Device not allowed, login anywhere else
					await destroySession();

					navigationRef.reset('Login');
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

		launchAppError(err, error.response.status, code);
	} else if (error.request) {
		err = 'Falha ao tentar se conectar ao servidor';

		console.log('The request was made but no response was received');
		console.error(error.request);
	}

	if (!!err && err !== '') {
		throw new AppError({
			message: err,
			internalErrorCode: code,
		});
	} else if (error instanceof Error) {
		throw new Error(error.message);
	} else {
		Promise.reject(error);
	}
}

export default errorsHandler;
