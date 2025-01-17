interface IProduct {
	id: string;
	name: string;
	code?: string;
	brand?: IBrand;
	thumbnail?: string;
	store?: IStore;
	category?: ICategory;
	batches: Array<IBatch>;
	created_at: Date;
	updated_at: Date;
}
