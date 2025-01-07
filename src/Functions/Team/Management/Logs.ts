import { getLocales } from 'react-native-localize';
import { parseISO, format } from 'date-fns';

import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

function getFormattedLogText(log: ILog): string {
	const dateFormat =
		getLocales()[0].languageCode === 'en' ? 'MM/dd/yyyy' : 'dd/MM/yyyy';

	let text = '';
	const who = log.user.name || log.user.email;
	const when = format(parseISO(log.created_at), dateFormat);

	let action = '';

	switch (log.action) {
		case 'Create_Product':
			action = `criou o produto ${log.product?.name}`;
			break;
		case 'Update_Product':
			action = `atualizou o produto ${log.product?.name}`;
			break;
		case 'Delete_Product':
			action = `apagou o produto ${log.product?.name}`;
			break;
		case 'Create_Batch':
			if (log.batch && log.product) {
				action = `criou o lote ${log.batch.name} do produto ${log.product.name}`;
			} else if (log.batch && !log.product) {
				action = `criou o lote ${log.batch.name}`;
			} else {
				action = `criou o lote ${log.new_value}`; // get the value of batch creation if it doesn't exists anymore
			}
			break;
		case 'Update_Batch':
			action = `atualizou o lote ${log.batch?.name} do produto ${log.product?.name}`;
			break;
		case 'Delete_Batch':
			action = `apagou o lote ${log.batch?.name} do produto ${log.product?.name}`;
			break;

		case 'Create_Category':
			action = `criou a categoria ${log.category?.name}`;
			break;

		case 'Update_Category':
			action = `atualizou a categoria ${log.category?.name}`;
			break;
		case 'Delete_Category':
			action = `apagou a categoria ${log.category?.name}`;
			break;
		case 'Set_Batch_Checked':
			if (log.batch && log.product) {
				action = `marcou o lote ${log.batch.name} do produto ${log.product.name}`;
			} else if (log.batch && !log.product) {
				action = `marcou o lote ${log.batch.name}`;
			} else {
				action = `marcou um lote (apagado)`;
			}
			break;

		default:
			break;
	}

	if (log.action === 'Set_Batch_Checked') {
		const checked = log.new_value ? 'tratado' : 'não tratado';
		text = `${who} ${action} como ${checked} em ${when}`;
	} else {
		text = `${who} ${action} em ${when}`;
	}

	return text;
}

async function getTeamLogs(): Promise<ILog[]> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const response = await api.get<ILog[]>(
		`/team/${currentTeam.id}/management/logs`
	);

	return response.data;
}

export { getTeamLogs, getFormattedLogText };
