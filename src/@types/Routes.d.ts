type RoutesParams = {
	Home;
	AddProduct:
		| {
				code?: string;
				category?: string;
				brand?: string;
				store?: string;
		  }
		| undefined;
	ProductsSortedByWeight;
	ProductsSortedByLiters;
	Settings;
	About;
	ProductDetails: {
		id: string;
	};
	AddBatch: {
		productId: string;
	};
	EditProduct: {
		productId: string;
	};
	EditBatch: {
		productId: string;
		batchId: string;
	};
	NoInternet;
	PhotoView: {
		productId: string;
	};
	ListCategory;
	CategoryView: {
		category_id: string;
		category_name?: string;
	};
	CategoryEdit: {
		id: string;
	};

	BrandList;
	BrandView: {
		brand_id: string;
	};
	BrandEdit: {
		brand_id: string;
	};

	StoreList;
	StoreView: {
		store_id: string;
		store_name: string;
	};
	StoreEdit: {
		store_id: string;
	};

	Export;

	BatchView: {
		product: string;
		batch: string;
	};
	BatchDiscount: {
		batch: string;
	};

	User;
	UserDetails: {
		user: string;
	};
	TeamLogs;
	Logout;

	EnterTeam: {
		userRole: IUserRoles;
	};
	TeamList;
	CreateTeam;
	ViewTeam;
	EditTeam;
	ListUsersFromTeam;

	Test;

	VerifyEmail;
	DeleteTeam;
	DeleteUser;

	Intro;
	Login;
	ForgotPassword;
	CreateAccount;
};
