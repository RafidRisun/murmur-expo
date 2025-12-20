import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	serverTimestamp,
	startAfter,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const createDocument = async (collectionName: string, data: any) => {
	return addDoc(collection(db, collectionName), {
		...data,
		createdAt: serverTimestamp(),
	});
};

export const deleteDocument = async (collectionName: string, docId: string) => {
	return deleteDoc(doc(db, collectionName, docId));
};

export const updateDocument = async (
	collectionName: string,
	docId: string,
	data: any
) => {
	return await updateDoc(doc(db, collectionName, docId), data);
};

export const getDocument = async (collectionName: string, docId: string) => {
	const docRef = doc(db, collectionName, docId);
	const snap = await getDoc(docRef);
	if (!snap.exists()) return null;
	return { id: snap.id, ...(snap.data() as any) };
};

export const getCollectionPaged = async <T>(
	collectionName: string,
	pageSize = 10,
	lastDoc?: QueryDocumentSnapshot<DocumentData>,
	filters?: { field: string; op: any; value: any }[]
) => {
	let q: any = collection(db, collectionName);

	if (filters) {
		filters.forEach(f => {
			q = query(q, where(f.field, f.op, f.value));
		});
	}

	q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));

	if (lastDoc) {
		q = query(q, startAfter(lastDoc));
	}

	const snap = await getDocs(q);

	return {
		items: snap.docs.map(d => ({ id: d.id, ...(d.data() as T) })),
		lastDoc: snap.docs[snap.docs.length - 1] ?? null,
	};
};
