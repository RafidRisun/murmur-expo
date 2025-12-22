import { useAuth } from '@/src/context/authContext';
import {
	followUser,
	getFollowingIdsForUser,
	unfollowUser,
} from '@/src/services/followService';
import { createMurmur, getAllMurmurs } from '@/src/services/murmurmService';
import { getAllUsers } from '@/src/services/userServices';
import { MurmurType } from '@/src/types/murmurType';
import { UserType } from '@/src/types/userType';
import { Button, Input } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Keyboard,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import tw from 'twrnc';

export default function Index() {
	const { user, isAuthenticated } = useAuth();
	const [newMurmur, setNewMurmur] = useState('');
	const [users, setUsers] = useState<UserType[]>([]);
	const [murmurs, setMurmurs] = useState<MurmurType[]>([]);
	const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		console.log('User in home index:', user);
		console.log('Is Authenticated in home index:', isAuthenticated);
	}, [user, isAuthenticated]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const allUsers = await getAllUsers();
				setUsers(allUsers);
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};

		fetchUsers();
	}, []);

	useEffect(() => {
		const fetchFollowing = async () => {
			if (!user?.uid) return;
			try {
				const ids = await getFollowingIdsForUser(user.uid);
				setFollowingIds(new Set(ids));
			} catch (e) {
				console.error('Error fetching following list:', e);
			}
		};
		fetchFollowing();
	}, [user?.uid]);

	useEffect(() => {
		const fetchMurmurs = async () => {
			try {
				const allMurmurs = await getAllMurmurs();
				setMurmurs(allMurmurs);
			} catch (error) {
				console.error('Error fetching murmurs:', error);
			}
		};

		fetchMurmurs();
	}, []);

	if (user === null) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	const handlePost = async () => {
		try {
			const response = await createMurmur(
				newMurmur,
				user?.username || 'Anonymous'
			);
			setNewMurmur('');
			if (response) {
				Alert.alert('Success', 'Murmur posted successfully!');
			}
		} catch (error) {
			console.error('Error posting murmur:', error);
			Alert.alert('Error', 'Failed to post murmur. Please try again.');
		}
	};

	const handleFollow = async (id: string) => {
		if (!user?.uid || user.uid === id) return;
		await followUser(user.uid, id);
		setFollowingIds(prev => new Set([...prev, id]));
	};

	const handleUnfollow = async (id: string) => {
		if (!user?.uid || user.uid === id) return;
		await unfollowUser(user.uid, id);
		setFollowingIds(prev => {
			const updated = new Set(prev);
			updated.delete(id);
			return updated;
		});
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
			<ScrollView style={tw`flex-1 bg-black`}>
				<View style={tw`flex flex-col justify-start items-center p-4`}>
					<Input
						style={tw`w-full`}
						placeholder="Any new Murmur?"
						value={newMurmur}
						onChangeText={setNewMurmur}
					/>
					<Button style={tw`mt-4 w-full`} onPress={handlePost}>
						Post Murmur
					</Button>
					<FlatList
						data={users}
						keyExtractor={item => item.id}
						contentContainerStyle={{ gap: 16 }}
						renderItem={({ item }) => (
							<View
								key={item.id}
								style={tw`p-4 border border-gray-700 rounded w-40 h-35 flex flex-col items-center justify-between`}
							>
								<Text style={tw`text-white text-lg font-bold`}>
									{item.username}
								</Text>
								{user?.uid === item.id ? null : followingIds.has(item.id) ? (
									<Button
										style={tw`mt-2`}
										onPress={() => handleUnfollow(item.id)}
									>
										Unfollow
									</Button>
								) : (
									<Button
										style={tw`mt-2`}
										onPress={() => handleFollow(item.id)}
									>
										Follow
									</Button>
								)}
							</View>
						)}
						horizontal
						showsHorizontalScrollIndicator={false}
						style={tw`flex w-full mt-6`}
					/>
					<View style={tw`flex flex-col items-start mt-6 w-full`}>
						{murmurs.map(murmur => (
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
						))}
					</View>
				</View>
			</ScrollView>
		</TouchableWithoutFeedback>
	);
}
