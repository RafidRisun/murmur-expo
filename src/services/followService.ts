import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { FollowType } from '../types/followType';
import { createDocument, deleteDocument } from './firebaseService';
import {
	decrementFollowerCount,
	decrementFollowingCount,
	incrementFollowerCount,
	incrementFollowingCount,
} from './userServices';

const COLLECTION = 'follows';

export const checkFollow = async (
	followerId: string,
	followingId: string
): Promise<boolean> => {
	const q = query(
		collection(db, COLLECTION),
		where('followerId', '==', followerId),
		where('followingId', '==', followingId)
	);
	const snap = await getDocs(q);
	if (snap.empty) return false;
	else return true;
};

export const followUser = async (followerId: string, followingId: string) => {
	const q = query(
		collection(db, 'follows'),
		where('followerId', '==', followerId),
		where('followingId', '==', followingId)
	);

	const snap = await getDocs(q);
	if (!snap.empty) return;

	await createDocument('follows', { followerId, followingId });
	await incrementFollowerCount(followingId);
	await incrementFollowingCount(followerId);
	return;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
	const q = query(
		collection(db, 'follows'),
		where('followerId', '==', followerId),
		where('followingId', '==', followingId)
	);

	const snap = await getDocs(q);
	if (snap.empty) return;

	await deleteDocument(COLLECTION, snap.docs[0].id);
	await decrementFollowerCount(followingId);
	await decrementFollowingCount(followerId);
	return;
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

// Efficient helper for UI: get IDs the user is following
export const getFollowingIdsForUser = async (
	followerId: string
): Promise<string[]> => {
	const q = query(
		collection(db, COLLECTION),
		where('followerId', '==', followerId)
	);
	const snap = await getDocs(q);
	return snap.docs.map(d => (d.data() as FollowType).followingId);
};
