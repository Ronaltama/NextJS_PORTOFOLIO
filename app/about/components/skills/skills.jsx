"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CodepenIcon, WebhookIcon, ActivityIcon, MobileIcon } from "./icons";
import SkillsData from "@/json/skills.json";

const iconMap = {
	web: CodepenIcon,
	api: WebhookIcon,
	iot: ActivityIcon,
	robotics: MobileIcon,
};

// Map json array into key-indexed object for component compatibility
const rawSkills = SkillsData.SkillCategories || [];
const skillCategories = {};
rawSkills.forEach((item) => {
	skillCategories[item.key] = {
		title: item.title,
		icon: iconMap[item.iconType] || CodepenIcon,
		description: item.description,
		languages: item.languages || [],
		tools: item.tools || [],
	};
});

function SkillCard({ skill, isSelected, onClick }) {
	const Icon = skill.icon;

	return (
		<motion.div
			onClick={onClick}
			className={`relative cursor-pointer group p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
				isSelected
					? "bg-white/20 border-black border-2 shadow-lg"
					: "bg-white/10 border-gray-300/20 hover:bg-white/20 hover:border-gray-300/30"
			}`}
			whileHover={{ scale: 1.05, rotateY: 5 }}
			whileTap={{ scale: 0.95 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}>
			{!isSelected && (
				<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-300/0 via-gray-300/10 to-gray-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
			)}

			<div className="flex items-center gap-4 mb-4">
				<div
					className={`p-3 rounded-xl transition-all duration-300 ${
						isSelected
							? "bg-black text-white"
							: "bg-white/20 text-gray-700 group-hover:bg-white/40 group-hover:text-black"
					}`}>
					{Icon && <Icon className="w-6 h-6" />}
				</div>
				<h3 className="font-bold text-xl text-black">{skill.title}</h3>
			</div>

			<p className="text-gray-600 text-sm mb-4 leading-relaxed">{skill.description}</p>

			<div className="flex items-center justify-between text-xs text-gray-500 font-medium">
				<span>{skill.languages.length} Tech Stack</span>
				<span>{skill.tools.length} Tools</span>
			</div>
		</motion.div>
	);
}

function SkillDetail({ skill }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			className="bg-white/10 backdrop-blur-lg border border-gray-300/30 rounded-3xl p-8 shadow-xl mt-8">
			<div className="grid md:grid-cols-2 gap-8">
				{/* Languages & Frameworks */}
				<div>
					<h4 className="font-bold text-lg text-black mb-4 flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-black"></span>
						Languages & Frameworks
					</h4>
					<div className="flex flex-wrap gap-2">
						{skill.languages.map((tech, index) => (
							<motion.span
								key={tech}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.05 }}
								className="px-4 py-2 bg-white/20 backdrop-blur-md border border-gray-300/30 text-black text-sm rounded-xl font-medium shadow-sm hover:bg-white/40 hover:scale-105 transition-all duration-200">
								{tech}
							</motion.span>
						))}
					</div>
				</div>

				{/* Tools & Environment */}
				<div>
					<h4 className="font-bold text-lg text-black mb-4 flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-gray-500"></span>
						Tools & Environment
					</h4>
					<div className="flex flex-wrap gap-2">
						{skill.tools.map((tool, index) => (
							<motion.span
								key={tool}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.05 }}
								className="px-4 py-2 bg-gray-100/30 backdrop-blur-md border border-gray-300/30 text-gray-700 text-sm rounded-xl font-medium shadow-sm hover:bg-gray-100/50 hover:scale-105 transition-all duration-200">
								{tool}
							</motion.span>
						))}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default function Skills() {
	const defaultKey = rawSkills[0]?.key || "web";
	const [selectedSkill, setSelectedSkill] = useState(defaultKey);

	return (
		<div className="container mx-auto px-4 py-16">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-center mb-12">
				<h2 className="text-4xl font-bold text-black mb-4 tracking-tight">Technical Skills</h2>
				<p className="text-gray-600 text-lg max-w-2xl mx-auto">
					Technologies, frameworks, and tools I use to bring ideas to life.
				</p>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{Object.entries(skillCategories).map(([key, skill]) => (
					<SkillCard
						key={key}
						skill={skill}
						isSelected={selectedSkill === key}
						onClick={() => setSelectedSkill(key)}
					/>
				))}
			</div>

			<AnimatePresence mode="wait">
				{selectedSkill && skillCategories[selectedSkill] && (
					<SkillDetail key={selectedSkill} skill={skillCategories[selectedSkill]} />
				)}
			</AnimatePresence>
		</div>
	);
}
