import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import { MurmurType } from '../types/murmurType';

export default function MurmurCard({ murmur }: { murmur: MurmurType }) {
	const router = useRouter();
	return (
		<View
			key={murmur.id}
			style={tw`mb-4 p-4 border border-gray-700 rounded w-full`}
		>
			<Pressable
				onPress={() =>
					router.push({
						pathname: '/(tabs)/home/profile',
						params: { userId: murmur.userId },
					})
				}
			>
				<Text style={tw`text-white text-lg font-bold`}>{murmur.username}</Text>
			</Pressable>
			<Text style={tw`text-white text-lg font-bold`}>{murmur.text}</Text>
		</View>
	);
}
