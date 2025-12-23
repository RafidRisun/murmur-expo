import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function CommonScreensLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitleStyle: { color: 'white', fontFamily: 'Arial' },
				headerStyle: { backgroundColor: 'black' },
				headerTitleAlign: 'center',

				headerLeft: () => (
					<TouchableOpacity onPress={() => router.back()}>
						<FontAwesome name="angle-left" size={24} color="white" />
					</TouchableOpacity>
				),
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: 'Murmur Details',
					headerBackButtonMenuEnabled: true,
					headerTintColor: 'white',
				}}
			/>
		</Stack>
	);
}
