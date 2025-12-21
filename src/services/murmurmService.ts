import { getAuth } from '@firebase/auth';
import { MurmurType } from './../types/murmurType';

import {
	createDocument,
	deleteDocument,
	getCollectionPaged,
	getDocument,
	updateDocument,
} from './firebaseService';

const COLLECTION = 'murmurs';

export const createMurmur = async (text: string, username: string) => {
	const user = getAuth().currentUser;

	if (!user) throw new Error('User not authenticated');

	return createDocument(COLLECTION, {
		text,
		userId: user.uid,
		username,
		likesCount: 0,
	});
};

export const deleteMurmur = async (murmurId: string) => {
	const user = getAuth().currentUser;
	if (!user) throw new Error('User not authenticated');
	return deleteDocument(COLLECTION, murmurId);
};

export const getTimelinePaginated = async (pageSize = 10, lastDoc?: any) => {
	return getCollectionPaged<MurmurType>(COLLECTION, pageSize, lastDoc);
};

export const getMurmurByUser = async (
	userId: string,
	pageSize = 10,
	lastDoc?: any
) => {
	return getCollectionPaged<MurmurType>(COLLECTION, pageSize, lastDoc, [
		{ field: 'userId', op: '==', value: userId },
	]);
};

export const getMurmurById = async (murmurId: string) => {
	return getDocument<MurmurType>(COLLECTION, murmurId);
};

export const likeMurmur = async (murmurId: string) => {
	const murmur = await getDocument<MurmurType>(COLLECTION, murmurId);
	if (!murmur) throw new Error('Murmur not found');

	return updateDocument(COLLECTION, murmurId, {
		likesCount: murmur.likesCount + 1,
	});
};
