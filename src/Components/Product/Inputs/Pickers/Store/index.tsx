import React, { useState, useCallback } from 'react';
import { ViewStyle } from 'react-native';

import strings from '@teams/Locales';

import { PickerContainer, Picker } from '@components/Picker/styles';

interface Props {
	stores: IPickerItem[];
	onChange: (value: string) => void;
	containerStyle?: ViewStyle;
	defaultValue?: string | null;
}

const Store: React.FC<Props> = ({
	stores,
	onChange,
	containerStyle,
	defaultValue,
}: Props) => {
	const [selectedStore, setSelectedStore] = useState<string | null>(() => {
		if (defaultValue && defaultValue !== '') {
			return defaultValue;
		}
		return null;
	});

	const sortedStores = stores.sort((a, b) => {
		if (a.label.toLowerCase() < b.label.toLowerCase()) {
			return -1;
		}
		if (a.label.toLowerCase() > b.label.toLowerCase()) {
			return 1;
		}
		return 0;
	});

	const handleOnChange = useCallback(
		(value: string) => {
			setSelectedStore(value);

			// call on change on parent to update value their
			onChange(value);
		},
		[onChange]
	);

	return (
		<PickerContainer style={containerStyle}>
			<Picker
				items={sortedStores}
				onValueChange={handleOnChange}
				value={selectedStore}
				placeholder={{
					label: 'Atribuir a uma loja',
					value: null,
				}}
			/>
		</PickerContainer>
	);
};

export default Store;
