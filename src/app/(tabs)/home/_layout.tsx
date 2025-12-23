import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function HomeLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitleStyle: { color: 'white', fontFamily: 'Arial' },
				headerStyle: { backgroundColor: 'black' },
				headerTitleAlign: 'center',
			}}
		>
			<Stack.Screen name="index" options={{ title: 'Murmur' }} />
			<Stack.Screen
				name="profile"
				options={{
					title: 'Profile',
					headerTintColor: 'white',
					headerLeft: () => (
						<TouchableOpacity onPress={() => router.back()}>
							<FontAwesome name="angle-left" size={24} color="white" />
						</TouchableOpacity>
					),
				}}
			/>
		</Stack>
	);
}
