import { setSetting, getHowManyTimesAppWasOpen } from './Settings';

async function increseAppOpenTimes(): Promise<void> {
	const oldValueOpenTimes = await getHowManyTimesAppWasOpen();
	const newOpenTimes = oldValueOpenTimes ? oldValueOpenTimes + 1 : 1;

	await setSetting({
		type: 'HowManyTimesAppWasOpen',
		value: String(newOpenTimes),
	});
}

increseAppOpenTimes();
