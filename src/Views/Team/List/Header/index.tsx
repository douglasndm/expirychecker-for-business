import React from 'react';

import strings from '@teams/Locales';

import Header from '@components/Header';

interface Props {
	isLoading: boolean;
	loadData: () => void;
	handleSettings: () => void;
}

const TeamListHeader: React.FC<Props> = (props: Props) => {
	return (
		<Header
			title={strings.View_TeamList_PageTitle}
			noDrawer
			appBarActions={[
				{
					icon: 'update',
					onPress: props.loadData,
					disabled: props.isLoading,
				},
			]}
			moreMenuItems={[
				{
					title: strings.View_TeamList_Button_Settings,
					onPress: props.handleSettings,
					leadingIcon: 'cog',
				},
			]}
		/>
	);
};

export default TeamListHeader;
