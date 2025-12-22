import { UserType } from '@/src/types/userType';
import { Button } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import tw from 'twrnc';

export default function Users({
	users,
	followingIds,
	handleFollow,
	handleUnfollow,
	user,
}: {
	users: UserType[];
	followingIds: Set<string>;
	handleFollow: (userId: string) => void;
	handleUnfollow: (userId: string) => void;
	user: any;
}) {
	const router = useRouter();
	return (
		<FlatList
			data={users}
			keyExtractor={item => item.id}
			contentContainerStyle={{ gap: 16 }}
			renderItem={({ item }) => (
				<Pressable
					key={item.id}
					style={tw`p-4 border border-gray-700 rounded w-40 h-35 flex flex-col items-center justify-between`}
					onPress={() => {
						router.push({
							pathname: '/(tabs)/home/profile',
							params: { userId: item.id },
						});
					}}
				>
					<Text style={tw`text-white text-lg font-bold`}>{item.username}</Text>
					{user?.uid === item.id ? null : followingIds.has(item.id) ? (
						<Button style={tw`mt-2`} onPress={() => handleUnfollow(item.id)}>
							Unfollow
						</Button>
					) : (
						<Button style={tw`mt-2`} onPress={() => handleFollow(item.id)}>
							Follow
						</Button>
					)}
				</Pressable>
			)}
			horizontal
			showsHorizontalScrollIndicator={false}
			style={tw`flex w-full mt-6`}
		/>
	);
}
