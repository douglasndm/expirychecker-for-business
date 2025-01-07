import DocumentPicker from 'react-native-document-picker';

import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

export async function importExportFileFromApp(): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const picked = await DocumentPicker.pick({
		type: [DocumentPicker.types.allFiles],
	});

	const data = new FormData();
	data.append('file', picked[0]);

	await api.post(`/team/${currentTeam.id}/products/import`, data, {
		headers: {
			'Content-Type': 'multipart/form-data; ',
		},
	});
}
