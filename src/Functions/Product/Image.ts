import { Platform } from 'react-native';

import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';
import { removeLocalImage } from '@utils/Images/RemoveLocally';

interface uploadImageProps {
	product_id: string;
	path: string;
}
async function uploadImage(props: uploadImageProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	const { product_id, path } = props;

	// Verificar a plataforma para construir o objeto Blob ou FormData corretamente
	const formData = new FormData();

	const uriParts = path.split('.');
	const fileType = uriParts[uriParts.length - 1];

	const splitedName = path.split('/');

	if (Platform.OS === 'android') {
		const fileUri = `file://${path}`;
		formData.append('image', {
			uri: fileUri,
			name: splitedName[splitedName.length - 1],
			type: `image/${fileType}`,
		});
	} else {
		formData.append('image', {
			uri: path,
			name: splitedName[splitedName.length - 1],
			type: `image/${fileType}`,
		});
	}

	await api.post(
		`/team/${currentTeam.id}/upload/product/${product_id}/image`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	);
}

interface removeImageProps {
	product_id: string;
}

async function removeImage(props: removeImageProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.delete(
		`/team/${currentTeam.id}/upload/product/${props.product_id}/image`
	);

	await removeLocalImage(props.product_id);
}

export { uploadImage, removeImage };
