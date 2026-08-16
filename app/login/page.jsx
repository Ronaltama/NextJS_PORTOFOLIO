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
	const { user, isAdmin, loginWithGoogle, loading, error } = useAuth();
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
		<main className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center relative px-4 font-sans selection:bg-zinc-800">
			{/* Back Link */}
			<Link
				href="/"
				className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-medium">
				<FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" /> Kembali ke Portofolio
			</Link>

			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full max-w-sm bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
				{/* Header */}
				<div className="flex justify-center mb-5">
					<div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
						<FontAwesomeIcon icon={faLock} className="text-base" />
					</div>
				</div>

				<h1 className="text-lg font-semibold text-center text-zinc-100 mb-1 tracking-tight">Admin Authentication</h1>
				<p className="text-zinc-500 text-center text-xs mb-6 leading-relaxed">
					Akses terbatas untuk <span className="text-zinc-300 font-mono">{ADMIN_EMAIL}</span>
				</p>

				{/* Error Alert */}
				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mb-5 p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-red-300 text-xs flex items-start gap-2.5">
						<FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 mt-0.5" />
						<div>
							<p className="font-semibold">Akses Ditolak</p>
							<p className="text-[11px] text-red-300/80 mt-0.5">{error}</p>
						</div>
					</motion.div>
				)}

				{/* Login Button */}
				<button
					onClick={handleGoogleLogin}
					disabled={isLoggingIn || loading}
					className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
					<FontAwesomeIcon icon={faGoogle} className="text-sm text-zinc-800" />
					<span>{isLoggingIn ? "Menghubungkan..." : "Sign in with Google"}</span>
				</button>

				<div className="mt-6 pt-5 border-t border-zinc-800/80 text-center text-[11px] text-zinc-600">
					Protected System & Role Restriction
				</div>
			</motion.div>
		</main>
	);
}
