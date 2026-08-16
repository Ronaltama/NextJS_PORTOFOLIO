"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const AuthContext = createContext({
	user: null,
	loading: true,
	isAdmin: false,
	loginWithGoogle: async () => {},
	logout: async () => {},
	error: null,
});

export const ADMIN_EMAIL =
	process.env.NEXT_PUBLIC_ADMIN_EMAIL || "tama.ronal@gmail.com";

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setUser(currentUser);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const loginWithGoogle = async () => {
		setError(null);
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const loggedInEmail = result.user?.email;

			if (loggedInEmail !== ADMIN_EMAIL) {
				await signOut(auth);
				setUser(null);
				setError(`Akses ditolak! Email (${loggedInEmail}) bukan email admin (${ADMIN_EMAIL}).`);
				return false;
			}
			return true;
		} catch (err) {
			console.error("Firebase Login Error:", err);
			setError(err.message || "Gagal melakukan login dengan Google.");
			return false;
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
			setUser(null);
		} catch (err) {
			console.error("Logout Error:", err);
		}
	};

	const isAdmin = Boolean(user && user.email === ADMIN_EMAIL);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				isAdmin,
				loginWithGoogle,
				logout,
				error,
				setError,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
