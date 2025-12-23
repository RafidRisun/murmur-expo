import Users from '@/src/components/home/Users';
import MurmurCard from '@/src/components/MurmurCard';
import { useAuth } from '@/src/context/authContext';
import {
	followUser,
	getFollowingIdsForUser,
	unfollowUser,
} from '@/src/services/followService';
import { createMurmur, getMurmursPaged } from '@/src/services/murmurmService';
import { getAllUsers } from '@/src/services/userServices';
import { MurmurType } from '@/src/types/murmurType';
import { UserType } from '@/src/types/userType';
import { Button, Input } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Keyboard,
	Text,
	View,
} from 'react-native';
import tw from 'twrnc';

export default function Index() {
	const { user, isAuthenticated } = useAuth();
	const [newMurmur, setNewMurmur] = useState('');
	const [users, setUsers] = useState<UserType[]>([]);

	const [murmurs, setMurmurs] = useState<MurmurType[]>([]);
	const [lastDoc, setLastDoc] = useState<any>(null);
	const [loadingMurmurs, setLoadingMurmurs] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		(async () => {
			try {
				const allUsers = await getAllUsers(user?.uid || '');
				setUsers(allUsers);

				if (user?.uid) {
					const ids = await getFollowingIdsForUser(user.uid);
					setFollowingIds(new Set(ids));
				}

				setLastDoc(null);
				setHasMore(true);
				await loadMurmurs(true);
			} catch (e) {
				console.error('Error refreshing data:', e);
			} finally {
				setRefreshing(false);
			}
		})();
	}, [user?.uid]);

	useEffect(() => {
		console.log('User in home index:', user);
		console.log('Is Authenticated in home index:', isAuthenticated);
	}, [user, isAuthenticated]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const allUsers = await getAllUsers(user?.uid || '');
				setUsers(allUsers);
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};

		fetchUsers();
	}, [user?.uid]);

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

	// useEffect(() => {
	// 	const fetchMurmurs = async () => {
	// 		try {
	// 			const allMurmurs = await getAllMurmurs();
	// 			setMurmurs(allMurmurs);
	// 		} catch (error) {
	// 			console.error('Error fetching murmurs:', error);
	// 		}
	// 	};

	// 	fetchMurmurs();
	// }, [murmurs]);
	useEffect(() => {
		loadMurmurs(true);
	}, []);

	const loadMurmurs = async (reset = false) => {
		if (loadingMurmurs || (!hasMore && !reset)) return;

		setLoadingMurmurs(true);

		try {
			const res = await getMurmursPaged(10, reset ? undefined : lastDoc);

			setMurmurs(prev => (reset ? res.murmurs : [...prev, ...res.murmurs]));

			setLastDoc(res.lastDoc);
			setHasMore(!!res.lastDoc);
		} catch (e) {
			console.error('Error loading murmurs:', e);
		} finally {
			setLoadingMurmurs(false);
		}
	};

	if (user === null) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'black',
				}}
			>
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
				setMurmurs(prev => [response, ...prev]);
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

	const removeMurmurFromList = (murmurId: string) => {
		setMurmurs(prevMurmurs =>
			prevMurmurs.filter(murmur => murmur.id !== murmurId)
		);
	};

	const headerComponent = (
		<View style={tw`flex flex-col justify-start items-center mb-4`}>
			<Input
				style={tw`w-full`}
				placeholder="Any new Murmur?"
				value={newMurmur}
				onChangeText={setNewMurmur}
			/>
			<Button style={tw`mt-4 w-full`} onPress={handlePost}>
				Post Murmur
			</Button>
			<Text style={tw`text-white text-lg font-bold mt-6 self-start`}>
				Users
			</Text>
			<Users
				users={users}
				followingIds={followingIds}
				handleFollow={handleFollow}
				handleUnfollow={handleUnfollow}
				user={user}
			/>
		</View>
	);

	return (
		<View style={tw`flex-1 bg-black p-4`}>
			<FlatList
				data={murmurs.filter(
					murmur =>
						followingIds.has(murmur.userId) || murmur.userId === user?.uid
				)}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<MurmurCard
						murmur={item}
						removeMurmurFromList={removeMurmurFromList}
					/>
				)}
				onEndReached={() => loadMurmurs()}
				onEndReachedThreshold={0.5}
				ListFooterComponent={
					loadingMurmurs ? (
						<ActivityIndicator color="white" style={{ marginVertical: 16 }} />
					) : null
				}
				ListHeaderComponent={headerComponent}
				refreshing={refreshing}
				onRefresh={onRefresh}
				contentContainerStyle={tw`pb-8`}
				style={tw`flex-1 bg-black`}
				keyboardShouldPersistTaps="handled"
				onScrollBeginDrag={() => Keyboard.dismiss()}
			/>
		</View>
	);
}
