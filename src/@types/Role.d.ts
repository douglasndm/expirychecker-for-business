interface IRole {
	name: 'repositor' | 'supervisor' | 'manager';
	status: 'completed' | 'pending' | null;
	code: string | null;
}
