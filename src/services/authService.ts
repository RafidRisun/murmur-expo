import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const signUpWithEmail = async (
	email: string,
	password: string,
	username: string
) => {
	const auth = getAuth();
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		await setDoc(doc(db, 'users', user.uid), {
			email: user.email,
			username: username,
			followingCount: 0,
			followersCount: 0,
			createdAt: serverTimestamp(),
		});
		return user;
	} catch (error) {
		throw error;
	}
};

export const signInWithEmail = async (email: string, password: string) => {
	const auth = getAuth();
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential.user;
	} catch (error) {
		throw error;
	}
};
