import { FirebaseError } from 'firebase/app';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export type AuthError = { code: string; message: string };

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
			followerCount: 0,
			createdAt: serverTimestamp(),
		});
		return user;
	} catch (error) {
		let code = 'unknown';
		if (error instanceof FirebaseError) {
			code = error.code ?? 'unknown';
		}

		let message = 'Something went wrong. Please try again.';

		switch (code) {
			case 'auth/invalid-email':
				message = 'Invalid email or password.';
				break;
			case 'auth/invalid-credential':
				message = 'Invalid email or password.';
				break;
			case 'auth/user-not-found':
				message = 'No account found with this email.';
				break;
			case 'auth/wrong-password':
				message = 'Incorrect password.';
				break;
			case 'auth/too-many-requests':
				message = 'Too many attempts. Try again later.';
				break;
		}

		throw { code, message } as AuthError;
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
	} catch (error: unknown) {
		console.log('Error in signInWithEmail:', error);
		let code = 'unknown';
		if (error instanceof FirebaseError) {
			code = error.code ?? 'unknown';
		}

		let message = 'Something went wrong. Please try again.';

		switch (code) {
			case 'auth/invalid-email':
				message = 'Invalid email or password.';
				break;
			case 'auth/invalid-credential':
				message = 'Invalid email or password.';
				break;
			case 'auth/user-not-found':
				message = 'No account found with this email.';
				break;
			case 'auth/wrong-password':
				message = 'Incorrect password.';
				break;
			case 'auth/too-many-requests':
				message = 'Too many attempts. Try again later.';
				break;
		}

		throw { code, message } as AuthError;
	}
};

export const signOutUser = async () => {
	try {
		await auth.signOut();
	} catch (error) {
		let code = 'unknown';
		if (error instanceof FirebaseError) {
			code = error.code ?? 'unknown';
		}

		let message = 'Something went wrong. Please try again.';
		throw { code, message } as AuthError;
	}
};
