import {
	collection,
	getDocs,
	increment,
	query,
	where,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { LikeType } from '../types/likeType';
import { MurmurType } from '../types/murmurType';
import { createDocument, getDocument, updateDocument } from './firebaseService';

const COLLECTION = 'like';

export const likeMurmur = async (userId: string, murmurId: string) => {
	try {
		const likeDoc = await createDocument(COLLECTION, { userId, murmurId });
		if (likeDoc) {
			const murmur = await getDocument<MurmurType>('murmurs', murmurId);
			if (murmur) {
				await updateDocument('murmurs', murmurId, {
					likeCount: increment(1),
				});
			}
		}
	} catch (error) {
		console.error('Error liking murmur:', error);
	}
};

export const unlikeMurmur = async (likeId: string, murmurId: string) => {
	try {
		await updateDocument(COLLECTION, likeId, {});
		const murmur = await getDocument<MurmurType>('murmurs', murmurId);
		if (murmur) {
			await updateDocument('murmurs', murmurId, {
				likeCount: increment(-1),
			});
		}
	} catch (error) {
		console.error('Error unliking murmur:', error);
	}
};

export const getLikesByUserId = async (userId: string): Promise<LikeType[]> => {
	const q = query(collection(db, COLLECTION), where('userId', '==', userId));
	const snapShot = await getDocs(q);
	return snapShot.docs.map(doc => ({
		id: doc.id,
		...(doc.data() as Omit<LikeType, 'id'>),
	}));
};
