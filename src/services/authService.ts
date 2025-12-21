import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export const signUpWithEmail = async (
	email: string,
	password: string,
	username: string
) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		await setDoc(doc(db, 'users', user.uid), {
			userId: user.uid,
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

export const signOutUser = async () => {
	try {
		await auth.signOut();
	} catch (error) {
		throw error;
	}
};
