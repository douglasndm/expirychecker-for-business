import api from '@teams/Services/API/Config';

import { getCurrentTeam } from '@teams/Utils/Settings/CurrentTeam';

interface updateUserRoleProps {
	user_id: string;
	newRole: 'repositor' | 'supervisor' | 'manager';
}

export async function updateUserRole({
	user_id,
	newRole,
}: updateUserRoleProps): Promise<void> {
	const currentTeam = await getCurrentTeam();

	if (!currentTeam) {
		throw new Error('Team is not selected');
	}

	await api.put(`/team/${currentTeam.id}/manager/user`, {
		user_id,
		role: newRole,
	});
}
