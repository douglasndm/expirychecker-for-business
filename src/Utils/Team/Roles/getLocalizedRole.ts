import strings from '@teams/Locales';

function getLocalizedRole(role: string): string {
	const roleLowerCase = role.toLowerCase();

	switch (roleLowerCase) {
		case 'manager':
			return strings.UserInfo_Role_Manager;
		case 'supervisor':
			return strings.UserInfo_Role_Supervisor;
		default:
			return strings.UserInfo_Role_Repositor;
	}
}

export { getLocalizedRole };
