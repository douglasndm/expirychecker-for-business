interface ITeamSubscription {
	id: string;
	expireIn: Date;
	membersLimit: number;
	team: ITeam;
}

interface Subscription {
	name: string;
	subscription: RevenueCatSubscription;
}

type RevenueCatSubscription = {
	expires_date: string;
	purchase_date: string;
	store: string;
	unsubscribe_detected_at: string | null;
};
