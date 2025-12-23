import ProfileComponent from '@/src/components/profile/ProfileComponent';
import { getMurmurByUserId } from '@/src/services/murmurmService';
import { getUserById } from '@/src/services/userServices';
import { MurmurType } from '@/src/types/murmurType';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
		(async () => {
			try {
				if (!userId || typeof userId !== 'string') return;
				const userData = await getUserById(userId);
				if (userData) {
					setUserName(userData.username);
					setFollowerCount(userData.followerCount || 0);
					setFollowingCount(userData.followingCount || 0);
				}
				const userMurmurs = await getMurmurByUserId(userId);
				setMurmurs(userMurmurs);
			} catch (e) {
				console.error('Error refreshing profile data:', e);
			} finally {
				setRefreshing(false);
			}
		})();
	}, [userId]);

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

	const removeMurmurFromList = (murmurId: string) => {
		setMurmurs(prevMurmurs =>
			prevMurmurs.filter(murmur => murmur.id !== murmurId)
		);
	};

	if (loading) {
		return (
			<View style={tw`flex-1 bg-black justify-center items-center`}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	return (
		<ProfileComponent
			murmurs={murmurs}
			removeMurmurFromList={removeMurmurFromList}
			refreshing={refreshing}
			onRefresh={onRefresh}
			userName={userName}
			followerCount={followerCount}
			followingCount={followingCount}
		/>
	);
}
