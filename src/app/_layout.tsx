import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import {
	Slot,
	useRootNavigationState,
	useRouter,
	useSegments,
} from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/authContext';

const InitialLayout = () => {
	const { isAuthenticated } = useAuth();
	const segments = useSegments();
	const router = useRouter();
	const rootNavigation = useRootNavigationState();

	useEffect(() => {
		console.log('Is Authenticated in RootLayout:', isAuthenticated);
		if (!rootNavigation?.key) return; // wait for router to mount
		if (segments[0] === '(tabs)' && !isAuthenticated) {
			router.replace('/auth/signin');
		} else if (segments[0] === 'auth' && isAuthenticated) {
			router.replace('/(tabs)/home');
		}
	}, [rootNavigation?.key, isAuthenticated, segments, router]);

	return (
		// <Stack screenOptions={{ headerShown: false }}>
		//   <Stack.Protected guard={!isAuthenticated}>
		//     <StatusBar style="dark" />
		//     <Stack.Screen name="auth" />
		//   </Stack.Protected>
		//   <Stack.Protected guard={isAuthenticated}>
		//     <Stack.Screen name="(tabs)" />
		//   </Stack.Protected>
		//   <Stack.Screen name="index" />
		// </Stack>
		<ApplicationProvider {...eva} theme={eva.dark}>
			<SafeAreaView style={{ flex: 1 }}>
				<Slot />
			</SafeAreaView>
		</ApplicationProvider>
	);
};

export default function RootLayout() {
	return (
		<AuthProvider>
			<InitialLayout />
		</AuthProvider>
	);
}
