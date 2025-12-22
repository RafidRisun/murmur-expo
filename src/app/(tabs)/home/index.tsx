import { useAuth } from '@/src/context/authContext';
import { createMurmur, getAllMurmurs } from '@/src/services/murmurmService';
import { getAllUsers } from '@/src/services/userServices';
import { MurmurType } from '@/src/types/murmurType';
import { UserType } from '@/src/types/userType';
import { Button, Input } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Keyboard,
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

	useEffect(() => {
		console.log('User in home index:', user);
		console.log('Is Authenticated in home index:', isAuthenticated);
	}, [user]);

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

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
			<View style={tw`flex-1 justify-start items-center bg-black p-4`}>
				<Input
					style={tw`w-full`}
					placeholder="Any new Murmur?"
					value={newMurmur}
					onChangeText={setNewMurmur}
				/>
				<Button style={tw`mt-4 w-full`} onPress={handlePost}>
					Post Murmur
				</Button>
				<View style={tw`flex flex-col items-start mt-6 w-full`}>
					{users.map(usr => (
						<View
							key={usr.id}
							style={tw`mb-4 p-4 border border-gray-700 rounded w-full`}
						>
							<View style={tw`flex-row justify-between items-center`}>
								<Text style={tw`text-white text-lg font-bold`}>
									{usr.username}
								</Text>
								<Text style={tw`text-gray-400`}>{usr.email}</Text>
							</View>
							<Text style={tw`text-gray-400 mt-2`}>
								Followers: {usr.followerCount} | Following: {usr.followingCount}
							</Text>
						</View>
					))}
				</View>
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
		</TouchableWithoutFeedback>
	);
}
