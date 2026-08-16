"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMedal,
	faGraduationCap,
	faTrophy,
	faAward,
	faChevronDown,
	faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Me4 from "@/public/image/me4.jpeg";
import Me5 from "@/public/image/me5.jpg";
import Me6 from "@/public/image/me6.jpg";
import EducationData from "@/json/education.json";

const iconMap = {
	trophy: faTrophy,
	medal: faMedal,
	award: faAward,
	graduation: faGraduationCap,
};

function Wrapper({ children }) {
	return (
		<div className="mx-auto container gap-10 p-10 grid grid-cols-1 my-10">
			<motion.div
				className="flex justify-center items-start flex-col mb-5"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}>
				{children}
			</motion.div>
		</div>
	);
}

export default function Education() {
	const [isExpanded, setIsExpanded] = useState(false);

	const edu = EducationData.Education || {};
	const achievementsList = EducationData.Achievements || [];

	const visibleAchievements = isExpanded ? achievementsList : achievementsList.slice(0, 6);
	const hasMoreAchievements = achievementsList.length > 6;

	return (
		<Wrapper>
			<section className="grid gap-8 md:gap-12 w-full">
				<motion.div
					className="text-center space-y-2"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Education</h1>
					<p className="text-muted-foreground max-w-[800px] mx-auto">
						Get to know more about my educational background.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Education Section - Left */}
					<motion.div
						className="px-5"
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}>
						<div className="font-medium text-lg mb-4">{edu.period || "2024 - Present"}</div>
						<div>
							<h2 className="font-semibold text-xl">{edu.institution}</h2>
							<h3 className="text-md font-normal mb-3">{edu.major}</h3>

							<div className="gap-4 mb-4 flex items-stretch md:h-[300px] xl:h-[400px]">
								<div className="flex-[1] transition-all duration-300 ease-in-out hover:flex-[3] group">
									<Image
										src={Me5}
										width={400}
										height={225}
										alt="University"
										className="rounded-lg w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
									/>
								</div>
								<div className="flex-[1] transition-all duration-300 ease-in-out hover:flex-[3] group">
									<Image
										src={Me4}
										width={400}
										height={225}
										alt="University"
										className="rounded-lg w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
									/>
								</div>
								<div className="flex-[1] transition-all duration-300 ease-in-out hover:flex-[3] group">
									<Image
										src={Me6}
										width={400}
										height={225}
										alt="University"
										className="rounded-lg w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
									/>
								</div>
							</div>

							<div className="space-y-3">
								{Array.isArray(edu.description) ? (
									edu.description.map((paragraph, idx) => (
										<p key={idx} className="text-gray-600 text-justify text-base leading-relaxed">
											{paragraph}
										</p>
									))
								) : (
									<p className="text-gray-600 text-justify text-base leading-relaxed">{edu.description}</p>
								)}
							</div>

							<div className="flex flex-wrap gap-2 mt-4 text-sm">
								{edu.expectedGraduation && (
									<div className="bg-gray-300 text-black px-3 py-1 rounded-2xl">{edu.expectedGraduation}</div>
								)}
								{edu.activities && (
									<div className="bg-gray-300 text-black px-3 py-1 rounded-2xl">{edu.activities}</div>
								)}
							</div>
						</div>
					</motion.div>

					{/* Achievements Section - Right */}
					<motion.div
						className="flex flex-col justify-start px-5 md:px-0"
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}>
						<h2 className="font-semibold text-xl mt-7">Achievements</h2>
						<p className="text-md font-normal mb-3 md:mb-6">Some of my achievements during my study.</p>

						<div className="relative">
							<div className="space-y-4">
								<AnimatePresence>
									{visibleAchievements.map((achievement, index) => (
										<motion.div
											key={achievement.id || index}
											className="group"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.5, delay: index * 0.05 }}>
											{(index === 0 || visibleAchievements[index - 1]?.year !== achievement.year) && (
												<div className="flex items-center gap-3 mb-3 mt-2">
													<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
														<span className="text-xs font-bold text-gray-600">{achievement.year}</span>
													</div>
													<div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
												</div>
											)}

											<div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-lg hover:bg-white/30 transition-all duration-300">
												<div className="flex items-center gap-4">
													<div className="aspect-square w-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
														<FontAwesomeIcon
															icon={iconMap[achievement.iconType] || faTrophy}
															className="h-4 w-4"
														/>
													</div>
													<div>
														<h3 className="font-medium">{achievement.title}</h3>
														<p className="text-sm">{achievement.subtitle}</p>
														<div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>

							{hasMoreAchievements && (
								<motion.div className="flex justify-center mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
									<button
										onClick={() => setIsExpanded(!isExpanded)}
										className="flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-full text-sm font-medium">
										<span>{isExpanded ? `Show Less` : `Show More`}</span>
										<FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="h-3 w-3" />
									</button>
								</motion.div>
							)}
						</div>
					</motion.div>
				</div>
			</section>
		</Wrapper>
	);
}
