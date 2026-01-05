"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const NavItems = ({ isNavOpen, setIsNavOpen }) => {
	const [isMobile, setIsMobile] = useState(false);

	const handleItemClick = () => {
		setIsNavOpen(false);
	};
	const navVariant = {
		open: {
			clipPath: `circle(1920px at calc(100% - 40px) 40px)`,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 40,
			},
		},
		closed: {
			clipPath: "circle(0px at calc(100% - 120px) 35px)",
			transition: {
				delay: 0.5,
				type: "spring",
				stiffness: 400,
				damping: 30,
			},
		},
	};
	useEffect(() => {
		const updateScreenWidth = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		// Initial check and event listener
		updateScreenWidth();
		window.addEventListener("resize", updateScreenWidth);

		// Clean up the event listener on unmount
		return () => {
			window.removeEventListener("resize", updateScreenWidth);
		};
	}, []);

	// Check screen width and adjust clipPath for smaller screens
	if (isMobile) {
		(navVariant.open = {
			clipPath: `circle(1920px at calc(100% - 40px) 40px)`,
			transition: {
				type: "tween",
			},
		}),
			(navVariant.closed = {
				clipPath: "circle(0px at calc(100% - 35px) 35px)",
				transition: {
					delay: 0.5,
					type: "spring",
					stiffness: 400,
					damping: 40,
				},
			});
	} else {
		(navVariant.open = {
			clipPath: `circle(2444px at calc(100% - 40px) 40px)`,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 40,
			},
		}),
			(navVariant.closed = {
				clipPath: "circle(0px at calc(100% - 120px) 35px)",
				transition: {
					delay: 0.5,
					type: "spring",
					stiffness: 400,
					damping: 40,
				},
			});
	}
	const itemVariants = {
		open: (custom) => ({
			opacity: 1,
			x: 0,
			rotate: 0,
			transition: {
				delay: custom,
				type: "spring",
				stiffness: 400,
				damping: 40,
			},
		}),
		closed: {
			opacity: 0,
			x: -80,
			rotate: 0,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 40,
			},
		},
	};

	return (
		<>
			<motion.div
				className={`fixed z-[45] w-full h-screen flex items-center justify-center backdrop-blur-md transition-all ease duration-700 overflow-hidden`}
				variants={navVariant}
				animate={isNavOpen ? "open" : "closed"}
				initial={false}>
				<div className="relative flex flex-col items-center min-h-[100vh] min-w-[100vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
					{/* Decorative elements */}
					<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
						<div className="absolute top-20 left-10 w-64 h-64 bg-gray-500/10 rounded-full blur-3xl"></div>
						<div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl"></div>
					</div>

					<div className="flex flex-col items-center space-y-6 my-auto mx-0 z-50">
						{/* title */}
						<motion.div
							variants={itemVariants}
							animate={isNavOpen ? "open" : "closed"}
							className="mb-8">
							<span className="text-sm uppercase tracking-[0.3em] text-gray-400 font-medium">Navigation</span>
						</motion.div>

						<Link href="/#home">
							<motion.div
								className="group relative px-8 py-3 cursor-pointer"
								onClick={handleItemClick}
								variants={itemVariants}
								animate={isNavOpen ? "open" : "closed"}
								custom={0.1}>
								<span className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-300"></span>
								<span className="relative text-3xl md:text-4xl font-bold text-white group-hover:text-gray-300 transition-colors duration-300">
									Home
								</span>
							</motion.div>
						</Link>

						<Link href="/about">
							<motion.div
								className="group relative px-8 py-3 cursor-pointer"
								onClick={handleItemClick}
								variants={itemVariants}
								animate={isNavOpen ? "open" : "closed"}
								custom={0.2}>
								<span className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-300"></span>
								<span className="relative text-3xl md:text-4xl font-bold text-white group-hover:text-gray-300 transition-colors duration-300">
									About
								</span>
							</motion.div>
						</Link>

						<Link href="/projects">
							<motion.div
								className="group relative px-8 py-3 cursor-pointer"
								onClick={handleItemClick}
								variants={itemVariants}
								animate={isNavOpen ? "open" : "closed"}
								custom={0.3}>
								<span className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-300"></span>
								<span className="relative text-3xl md:text-4xl font-bold text-white group-hover:text-gray-300 transition-colors duration-300">
									Projects
								</span>
							</motion.div>
						</Link>

						<Link href="/#contact">
							<motion.div
								className="group relative px-8 py-3 cursor-pointer"
								onClick={handleItemClick}
								variants={itemVariants}
								animate={isNavOpen ? "open" : "closed"}
								custom={0.4}>
								<span className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-300"></span>
								<span className="relative text-3xl md:text-4xl font-bold text-white group-hover:text-gray-300 transition-colors duration-300">
									Get in Touch
								</span>
							</motion.div>
						</Link>

						{/* Social links hint */}
						<motion.div
							variants={itemVariants}
							animate={isNavOpen ? "open" : "closed"}
							custom={0.5}
							className="mt-12 flex items-center gap-4">
							<div className="w-12 h-px bg-gray-600"></div>
							<span className="text-sm text-gray-500">Scroll to explore</span>
							<div className="w-12 h-px bg-gray-600"></div>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</>
	);
};

const Navbar = () => {
	const navRef = useRef(null);
	const [isNavOpen, setIsNavOpen] = useState(false);

	const toggleNav = () => {
		setIsNavOpen(!isNavOpen);
	};

	return (
		<>
			<nav
				ref={navRef}
				className={`navbar px-5 md:px-24 w-screen fixed transition-colors ease duration-500 ${isNavOpen
					? "backdrop-filter backdrop-blur-md bg-gray-700 bg-opacity-50"
					: "backdrop-filter backdrop-blur-md"
					} inset-0  bg-opacity-50 flex flex-row justify-between items-center h-16 z-50 `}>
				<div>
					<h1
						className={`text-2xl ml-2 md:ml-0 transition-colors ease duration-500 ${isNavOpen ? "text-white" : ""
							}`}>
						Ronaltama
					</h1>
				</div>
				<div className="flex flex-row items-center">
					<button
						className="burger button flex flex-col justify-center items-center w-12 h-12 rounded-xl hover:bg-gray-200 transition-all duration-300 relative group"
						onClick={toggleNav}
						aria-label="Toggle navigation">
						<div className="flex flex-col justify-center items-center space-y-1.5">
							<div
								className={`w-7 h-0.5 rounded-full transition-all ease duration-300 ${isNavOpen
									? "rotate-45 translate-y-2 bg-white"
									: "bg-gray-800 group-hover:w-8"
									}`}></div>
							<div
								className={`w-7 h-0.5 rounded-full transition-all ease duration-300 ${isNavOpen
									? "opacity-0 scale-0"
									: "bg-gray-800 group-hover:w-5"
									}`}></div>
							<div
								className={`w-7 h-0.5 rounded-full transition-all ease duration-300 ${isNavOpen
									? "-rotate-45 -translate-y-2 bg-white"
									: "bg-gray-800 group-hover:w-6"
									}`}></div>
						</div>
					</button>
				</div>
			</nav>
			{/* items */}
			<NavItems isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
		</>
	);
};
export default Navbar;
