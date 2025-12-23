import { useAuth } from '@/src/context/authContext';
import {
	deleteMurmur,
	getMurmurById,
	likeMurmur,
} from '@/src/services/murmurmService';
import { MurmurType } from '@/src/types/murmurType';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function MurmurDetails() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { user } = useAuth();
	const [murmur, setMurmur] = useState<(MurmurType & { id: string }) | null>(
		null
	);
	const router = useRouter();

	useEffect(() => {
		const fetchMurmur = async () => {
			try {
				// Assuming there's a service function to get a murmur by ID
				const fetchedMurmur = await getMurmurById(id);
				setMurmur(fetchedMurmur);
			} catch (error) {
				console.error('Error fetching murmur details:', error);
			}
		};

		fetchMurmur();
	}, [id]);

	const handleDelete = async (id: string) => {
		try {
			await deleteMurmur(id);
			router.replace('/(tabs)/home');
		} catch (error) {
			console.error('Error deleting murmur:', error);
		}
	};

	const handleLike = async (id: string) => {
		// Implement like functionality here
		console.log(`Liked murmur with ID: ${id}`);
		try {
			await likeMurmur(id);
			setMurmur(prev =>
				prev
					? {
							...prev,
							likesCount: prev.likesCount + 1,
					  }
					: prev
			);
		} catch (error) {
			console.error('Error liking murmur:', error);
		}
	};

	return (
		<View style={tw`flex-1 justify-start items-center bg-black p-4`}>
			<View style={tw`mb-4 p-4 border border-gray-700 rounded w-full`}>
				{user?.uid === murmur?.userId && (
					<TouchableOpacity
						style={tw`absolute top-4 right-4`}
						onPress={() => handleDelete(id)}
					>
						<FontAwesome name="trash" size={18} color="#ffffff" />
					</TouchableOpacity>
				)}
				<TouchableOpacity
					onPress={() =>
						router.push({
							pathname:
								id === user?.uid ? '/(tabs)/profile' : '/(tabs)/home/profile',
							params: { userId: id },
						})
					}
					style={tw`w-1/2 pb-2`}
				>
					<Text style={tw`text-white text-sm font-bold`}>
						{murmur?.username}&apos;s Murmur
					</Text>
				</TouchableOpacity>
				<Text style={tw`text-white text-lg font-normal`}>
					{'	'}
					{murmur?.text}
				</Text>
				<View style={tw`flex flex-row justify-between mt-4`}>
					<Text style={tw`text-gray-400 text-sm`}>
						{murmur?.likesCount || 0} Likes
					</Text>
					<TouchableOpacity onPress={() => handleLike(id as string)}>
						<FontAwesome name="heart" size={20} color="#ffffff" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
