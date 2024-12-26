interface IUserRoles {
	team: ITeam;
	status: 'pending' | 'completed' | null;
	role: 'manager' | 'supervisor' | 'repositor';
	store: IStore | null;
}
