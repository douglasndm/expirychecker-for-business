enum ITarget {
	User,
	Team,
	Brand,
	Category,
	Store,
	Product,
	Batch,
}

enum IAction {
	Create_Product,
	Update_Product,
	Delete_Product,
	Create_Batch,
	Update_Batch,
	Delete_Batch,
	Create_Category,
	Update_Category,
	Delete_Category,
	Set_Batch_Checked,
}

export { ITarget, IAction };
