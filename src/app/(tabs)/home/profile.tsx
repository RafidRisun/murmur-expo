import { getMurmurByUserId } from '@/src/services/murmurmService';
import { getUserById } from '@/src/services/userServices';
import { MurmurType } from '@/src/types/murmurType';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from 'react-native';
import tw from 'twrnc';

export default function Profile() {
	const { userId } = useLocalSearchParams();
	const [userName, setUserName] = useState<string>('');
	const [followerCount, setFollowerCount] = useState<number>(0);
	const [followingCount, setFollowingCount] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [murmurs, setMurmurs] = useState<MurmurType[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 2000);
	}, []);

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

	useEffect(() => {
		const fetchUserMurmurs = async () => {
			if (!userId || typeof userId !== 'string') return;
			try {
				const userMurmurs = await getMurmurByUserId(userId);
				setMurmurs(userMurmurs);
			} catch (error) {
				console.error('Error fetching user murmurs:', error);
			}
		};

		fetchUserMurmurs();
	}, [userId]);

	if (loading) {
		return (
			<View style={tw`flex-1 bg-black justify-center items-center`}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			style={tw`flex-1 bg-black`}
		>
			<View style={tw`flex-1 bg-black justify-start items-center`}>
				<Text style={tw`text-white text-2xl font-bold mb-4`}>{userName}</Text>
				<View style={tw`flex flex-row items-center gap-4`}>
					<Text style={tw`text-white text-lg`}>Followers: {followerCount}</Text>
					<Text style={tw`text-white text-lg`}>
						Following: {followingCount}
					</Text>
				</View>
				<View style={tw`mt-6 w-full px-4`}>
					<Text style={tw`text-white text-xl font-semibold mb-4`}>Murmurs</Text>
					{murmurs.length === 0 ? (
						<Text style={tw`text-white`}>No murmurs to display.</Text>
					) : (
						murmurs.map(murmur => (
							<View
								key={murmur.id}
								style={tw`mb-4 p-4 border border-gray-700 rounded w-full`}
							>
								<Text style={tw`text-white text-lg font-bold`}>
									{murmur.username}
								</Text>
								<Text style={tw`text-white text-lg font-bold`}>
									{murmur.text}
								</Text>
							</View>
						))
					)}
				</View>
			</View>
		</ScrollView>
	);
}
