import DocumentPicker from 'react-native-document-picker';

import api from '@teams/Services/API';

interface importExportFileFromAppProps {
	team_id: string;
}

export async function importExportFileFromApp({
	team_id,
}: importExportFileFromAppProps): Promise<void> {
	const picked = await DocumentPicker.pick({
		type: [DocumentPicker.types.allFiles],
	});

	const data = new FormData();
	data.append('file', picked[0]);

	await api.post(`/team/${team_id}/products/import`, data, {
		headers: {
			'Content-Type': 'multipart/form-data; ',
		},
	});
}
