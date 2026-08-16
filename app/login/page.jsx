"use client";

import { useAuth, ADMIN_EMAIL } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faLock, faExclamationTriangle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function LoginPage() {
	const { user, isAdmin, loginWithGoogle, loading, error, setError } = useAuth();
	const router = useRouter();
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	useEffect(() => {
		if (!loading && isAdmin) {
			router.push("/admin");
		}
	}, [user, isAdmin, loading, router]);

	const handleGoogleLogin = async () => {
		setIsLoggingIn(true);
		const success = await loginWithGoogle();
		setIsLoggingIn(false);
		if (success) {
			router.push("/admin");
		}
	};

	return (
		<main className="min-h-screen bg-slate-950 text-white flex items-center justify-center relative overflow-hidden px-4">
			{/* Gradient Glow Effects */}
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

			{/* Back Link */}
			<Link
				href="/"
				className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
				<FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Home
			</Link>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
				{/* Icon Header */}
				<div className="flex justify-center mb-6">
					<div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
						<FontAwesomeIcon icon={faLock} className="text-slate-950 text-2xl" />
					</div>
				</div>

				<h1 className="text-2xl font-bold text-center text-white mb-2">Admin Portal</h1>
				<p className="text-slate-400 text-center text-sm mb-6">
					Khusus Admin (<span className="text-emerald-400 font-mono">{ADMIN_EMAIL}</span>) untuk mengelola data portofolio.
				</p>

				{/* Error Alert */}
				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3">
						<FontAwesomeIcon icon={faExclamationTriangle} className="text-rose-400 mt-0.5" />
						<div>
							<p className="font-semibold">Akses Ditolak</p>
							<p className="text-xs text-rose-300/90 mt-1">{error}</p>
						</div>
					</motion.div>
				)}

				{/* Login Button */}
				<button
					onClick={handleGoogleLogin}
					disabled={isLoggingIn || loading}
					className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-white font-medium text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
					<FontAwesomeIcon icon={faGoogle} className="text-emerald-400 text-lg" />
					<span>{isLoggingIn ? "Menghubungkan ke Google..." : "Sign in with Google"}</span>
				</button>

				<div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
					Protected by Firebase Authentication & Role Security
				</div>
			</motion.div>
		</main>
	);
}
