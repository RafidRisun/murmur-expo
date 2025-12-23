import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../context/authContext';
import { deleteMurmur, likeMurmur } from '../services/murmurmService';
import { MurmurType } from '../types/murmurType';

export default function MurmurCard({
	murmur,
	removeMurmurFromList,
}: {
	murmur: MurmurType;
	removeMurmurFromList: (id: string) => void;
}) {
	const router = useRouter();
	//const [localLikes, setLocalLikes] = useState(murmur.likesCount ?? 0);
	const [localMurmur, setLocalMurmur] = useState<MurmurType>(murmur);
	const { user } = useAuth();

	const handleLike = async (murmurId: string) => {
		// Implement like functionality here
		console.log(`Liked murmur with ID: ${murmurId}`);
		try {
			await likeMurmur(murmurId);
			setLocalMurmur(prev => ({
				...prev,
				likesCount: (prev.likesCount || 0) + 1,
			}));
		} catch (error) {
			console.error('Error liking murmur:', error);
		}
	};

	const handleDelete = async (murmurId: string) => {
		try {
			await deleteMurmur(murmurId);
			removeMurmurFromList(murmurId);
		} catch (error) {
			console.error('Error deleting murmur:', error);
		}
	};

	return (
		<Pressable
			key={murmur.id}
			style={tw`mb-4 p-4 border border-gray-700 rounded w-full`}
			onPress={() =>
				router.push({
					pathname: '/murmurDetails',
					params: { id: murmur.id },
				})
			}
		>
			{user?.uid === murmur.userId && (
				<TouchableOpacity
					style={tw`absolute top-4 right-4`}
					onPress={() => handleDelete(murmur.id)}
				>
					<FontAwesome name="trash" size={18} color="#ffffff" />
				</TouchableOpacity>
			)}
			<TouchableOpacity
				onPress={() =>
					router.push({
						pathname:
							murmur.userId === user?.uid
								? '/(tabs)/profile'
								: '/(tabs)/home/profile',
						params: { userId: murmur.userId },
					})
				}
				style={tw`w-1/2 pb-2`}
			>
				<Text style={tw`text-white text-sm font-bold`}>
					{murmur.username}&apos;s Murmur
				</Text>
			</TouchableOpacity>
			<Text style={tw`text-white text-lg font-normal`}>
				{'	'}
				{murmur.text}
			</Text>
			<View style={tw`flex flex-row justify-between mt-4`}>
				<Text style={tw`text-gray-400 text-sm`}>
					{localMurmur.likesCount || 0} Likes
				</Text>
				<TouchableOpacity onPress={() => handleLike(murmur.id)}>
					<FontAwesome name="heart" size={20} color="#ffffff" />
				</TouchableOpacity>
			</View>
		</Pressable>
	);
}
