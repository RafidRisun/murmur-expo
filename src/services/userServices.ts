import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { UserType } from '../types/userType';
import { getDocument } from './firebaseService';

const COLLECTION = 'users';

export const getUserById = async (userId: string) => {
	return getDocument<UserType>(COLLECTION, userId);
};

export const getAllUsers = async (): Promise<UserType[]> => {
	const snapShot = await getDocs(collection(db, COLLECTION));

	return snapShot.docs.map(doc => ({
		id: doc.id,
		...(doc.data() as Omit<UserType, 'id'>),
	}));
};
