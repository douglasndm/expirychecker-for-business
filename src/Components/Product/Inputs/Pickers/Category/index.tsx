import React, { useState, useCallback } from 'react';
import { ViewStyle } from 'react-native';

import strings from '@teams/Locales';

import { PickerContainer, Picker } from '@components/Picker/styles';

interface Props {
	categories: ICategoryItem[];
	onChange: (value: string) => void;
	containerStyle?: ViewStyle;
	defaultValue?: string | null;
}

const CategorySelect: React.FC<Props> = ({
	categories,
	onChange,
	containerStyle,
	defaultValue,
}: Props) => {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		() => {
			if (defaultValue && defaultValue !== '') {
				return defaultValue;
			}
			return null;
		}
	);

	const sortedCategories = categories.sort((a, b) => {
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
			setSelectedCategory(value);

			// call on change on parent to update value their
			onChange(value);
		},
		[onChange]
	);

	return (
		<PickerContainer style={containerStyle}>
			<Picker
				items={sortedCategories}
				onValueChange={handleOnChange}
				value={selectedCategory}
				placeholder={{
					label: strings.View_AddProduct_InputPlaceholder_SelectCategory,
					value: 'null',
				}}
			/>
		</PickerContainer>
	);
};

export default CategorySelect;
