import { getUserById } from '@/src/services/userServices';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import tw from 'twrnc';

export default function Profile() {
	const { userId } = useLocalSearchParams();
	const [userName, setUserName] = useState<string>('');
	const [followerCount, setFollowerCount] = useState<number>(0);
	const [followingCount, setFollowingCount] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			if (!userId || typeof userId !== 'string') return;
			try {
				const userData = await getUserById(userId);
				if (userData) {
					setUserName(userData.username);
					setFollowerCount(userData.followerCount || 0);
					setFollowingCount(userData.followingCount || 0);
					setLoading(false);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, [userId]);

	if (loading) {
		return (
			<View style={tw`flex-1 bg-black justify-center items-center`}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	return (
		<View style={tw`flex-1 bg-black justify-start items-center`}>
			<Text style={tw`text-white text-2xl font-bold mb-4`}>{userName}</Text>
			<View style={tw`flex flex-row items-center gap-4`}>
				<Text style={tw`text-white text-lg`}>Followers: {followerCount}</Text>
				<Text style={tw`text-white text-lg`}>Following: {followingCount}</Text>
			</View>
		</View>
	);
}
