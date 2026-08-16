import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy_api_key_for_build",
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "portofolio-43cf4.firebaseapp.com",
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portofolio-43cf4",
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "portofolio-43cf4.firebasestorage.app",
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:dummy",
};

let app;
let auth;
let googleProvider;

if (!getApps().length) {
	app = initializeApp(firebaseConfig);
} else {
	app = getApp();
}

auth = getAuth(app);
googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
