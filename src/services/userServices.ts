import { collection, getDocs, increment, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { UserType } from '../types/userType';
import { getDocument, updateDocument } from './firebaseService';

const COLLECTION = 'users';

export const getUserById = async (userId: string) => {
	return getDocument<UserType>(COLLECTION, userId);
};

export const getAllUsers = async (currentUserId: string): Promise<UserType[]> => {
	const q = query(
		collection(db, COLLECTION),
		where('userId', '!=', currentUserId)
	);
	const snapShot = await getDocs(q);

	return snapShot.docs.map(doc => ({
		id: doc.id,
		...(doc.data() as Omit<UserType, 'id'>),
	}));
};

export const incrementFollowerCount = async (userId: string) => {
	return updateDocument(COLLECTION, userId, {
		followerCount: increment(1),
	});
};

export const incrementFollowingCount = async (userId: string) => {
	return updateDocument(COLLECTION, userId, {
		followingCount: increment(1),
	});
};

export const decrementFollowerCount = async (userId: string) => {
	return updateDocument(COLLECTION, userId, {
		followerCount: increment(-1),
	});
};
export const decrementFollowingCount = async (userId: string) => {
	return updateDocument(COLLECTION, userId, {
		followingCount: increment(-1),
	});
};
