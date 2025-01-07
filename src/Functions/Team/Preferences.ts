import api from '@teams/Services/API/Config';

interface getTeamPreferencesProps {
	team_id: string;
}

async function getTeamPreferences({
	team_id,
}: getTeamPreferencesProps): Promise<ITeamPreferences> {
	const response = await api.get<ITeamPreferences>(
		`/team/${team_id}/preferences`
	);

	return response.data;
}

interface updateTeamPreferencesProps {
	team_id: string;
	preferences: Omit<ITeamPreferences, 'id'>;
}

async function updateTeamPreferences({
	team_id,
	preferences,
}: updateTeamPreferencesProps): Promise<ITeamPreferences> {
	const response = await api.put<ITeamPreferences>(
		`/team/${team_id}/preferences`,
		{
			daysToBeNext: preferences.daysToBeNext,
		}
	);

	return response.data;
}

export { getTeamPreferences, updateTeamPreferences };
