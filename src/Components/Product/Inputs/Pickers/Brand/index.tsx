import React, { useState, useCallback } from 'react';
import { ViewStyle } from 'react-native';

import strings from '@teams/Locales';

import { PickerContainer, Picker } from '@components/Picker/styles';

interface Props {
	brands: IBrandItem[];
	onChange: (value: string) => void;
	containerStyle?: ViewStyle;
	defaultValue?: string | null;
}

const Brand: React.FC<Props> = ({
	brands,
	onChange,
	containerStyle,
	defaultValue,
}: Props) => {
	const [selectedBrand, setSelectedBrand] = useState<string | null>(() => {
		if (defaultValue && defaultValue !== '') {
			return defaultValue;
		}
		return null;
	});

	const sortedBrands = brands.sort((a, b) => {
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
			setSelectedBrand(value);

			// call on change on parent to update value their
			onChange(value);
		},
		[onChange]
	);

	return (
		<PickerContainer style={containerStyle}>
			<Picker
				items={sortedBrands}
				onValueChange={handleOnChange}
				value={selectedBrand}
				placeholder={{
					label: strings.View_AddProduct_InputPlaceholder_SelectBrand,
					value: null,
				}}
			/>
		</PickerContainer>
	);
};

export default Brand;
