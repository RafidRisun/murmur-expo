import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { FollowType } from '../types/followType';
import { createDocument, deleteDocument } from './firebaseService';

const COLLECTION = 'follows';

export const followUser = async (followerId: string, followingId: string) => {
	const q = query(
		collection(db, COLLECTION),
		where('followerId', '==', followerId),
		where('followingId', '==', followingId)
	);

	const snap = await getDocs(q);
	if (!snap.empty) return;

	return createDocument(COLLECTION, { followerId, followingId });
};

export const unfollowUser = async (followId: string) => {
	return await deleteDocument(COLLECTION, followId);
};

export const getAllFollowers = async (
	userId: string
): Promise<FollowType[]> => {
	const q = query(
		collection(db, COLLECTION),
		where('followingId', '==', userId)
	);

	const snapshot = await getDocs(q);

	return snapshot.docs.map(doc => ({
		id: doc.id,
		...(doc.data() as Omit<FollowType, 'id'>),
	}));
};

export const getAllFollowing = async (
	userId: string
): Promise<FollowType[]> => {
	const q = query(
		collection(db, COLLECTION),
		where('followerId', '==', userId)
	);

	const snapshot = await getDocs(q);

	return snapshot.docs.map(doc => ({
		id: doc.id,
		...(doc.data() as Omit<FollowType, 'id'>),
	}));
};
