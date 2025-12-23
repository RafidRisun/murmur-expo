import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import {
	signInWithEmail,
	signOutUser,
	signUpWithEmail,
} from '../services/authService';
import { getUserById } from '../services/userServices';

interface AuthContextType {
	isAuthenticated: boolean;
	signIn: (
		email: string,
		password: string
	) => Promise<{
		success: boolean;
		user?: User & { username?: string };
		error?: any;
	}>;
	signOut: () => Promise<void>;
	signUp: (
		email: string,
		password: string,
		username: string
	) => Promise<{
		success: boolean;
		user?: User & { username?: string };
		error?: any;
	}>;
	user: (User & { username?: string }) | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<(User & { username?: string }) | null>(null);
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, currentUser => {
			if (currentUser) {
				setIsAuthenticated(true);
				//setUser(currentUser);
				updatedUserData(currentUser);
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
		});
		return () => unsub();
	}, []);

	const updatedUserData = async (currentUser: User) => {
		const userData = await getUserById(currentUser.uid);

		if (userData) {
			setUser({
				...currentUser,
				username: userData.username,
			});
		} else {
			setUser(currentUser);
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			const user = await signInWithEmail(email, password);
			// setIsAuthenticated(true);
			// //setUser(user);
			// updatedUserData(user);
			return { success: true, user };
		} catch (error) {
			return { success: false, error };
		}
	};

	const signOut = async () => {
		try {
			await signOutUser();
			setIsAuthenticated(false);
			setUser(null);
		} catch (error) {
			throw error;
		}
	};

	const signUp = async (email: string, password: string, username: string) => {
		try {
			const user = await signUpWithEmail(email, password, username);
			return { success: true, user };
		} catch (error) {
			return { success: false, error };
		}
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, signIn, signOut, signUp, user }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const value = useContext(AuthContext);
	if (!value) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return value;
};
