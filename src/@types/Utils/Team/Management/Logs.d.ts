interface ILog {
	id: string;
	user: IUser;
	team: ITeam;
	product?: IProduct;
	batch?: IBatch;
	category?: ICategory;
	action: string;
	new_value?: string;
	old_value?: string;
	created_at: string;
}
