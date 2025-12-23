import { MurmurType } from '@/src/types/murmurType';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import tw from 'twrnc';
import MurmurCard from '../MurmurCard';

export default function ProfileComponent({
	murmurs,
	removeMurmurFromList,
	refreshing,
	onRefresh,
	userName,
	followerCount,
	followingCount,
}: {
	murmurs: MurmurType[];
	removeMurmurFromList: (id: string) => void;
	refreshing: boolean;
	onRefresh: () => void;
	userName: string;
	followerCount: number;
	followingCount: number;
}) {
	const headerComponent = (
		<View style={tw`flex-1 bg-black justify-start items-center mb-4`}>
			<Text style={tw`text-white text-2xl font-bold mb-4`}>{userName}</Text>
			<View style={tw`flex flex-row items-center gap-4`}>
				<Text style={tw`text-white text-lg`}>Followers: {followerCount}</Text>
				<Text style={tw`text-white text-lg`}>Following: {followingCount}</Text>
			</View>
			<View style={tw`mt-6 w-full px-4`}>
				<Text style={tw`text-white text-xl font-semibold mb-4`}>Murmurs</Text>
			</View>
		</View>
	);

	return (
		<View style={tw`flex-1 bg-black p-4`}>
			<FlatList
				data={murmurs}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<MurmurCard
						murmur={item}
						removeMurmurFromList={removeMurmurFromList}
					/>
				)}
				ListHeaderComponent={headerComponent}
				ListEmptyComponent={
					<View style={tw`px-4 pb-8`}>
						<Text style={tw`text-white`}>No murmurs to display.</Text>
					</View>
				}
				refreshing={refreshing}
				onRefresh={onRefresh}
				contentContainerStyle={tw`pb-8`}
				style={tw`flex-1 bg-black`}
			/>
		</View>
	);
}
