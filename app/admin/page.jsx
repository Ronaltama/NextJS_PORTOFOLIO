"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import initialProjectsData from "@/json/data.json";
import initialExperiencesData from "@/json/experiences.json";
import initialEducationData from "@/json/education.json";
import initialSkillsData from "@/json/skills.json";
import initialProfileData from "@/json/profile.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSignOutAlt,
	faPlus,
	faEdit,
	faTrash,
	faSave,
	faUpload,
	faCheckCircle,
	faExclamationCircle,
	faSpinner,
	faEye,
	faEyeSlash,
	faImage,
	faFolderOpen,
	faBriefcase,
	faGraduationCap,
	faTrophy,
	faCode,
	faUser,
	faQuoteLeft,
	faLink,
	faArrowLeft,
	faStar,
	faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function AdminPage() {
	const { user, isAdmin, loading, logout } = useAuth();
	const router = useRouter();

	const [activeTab, setActiveTab] = useState("projects");
	const [projects, setProjects] = useState(initialProjectsData.Projects || []);
	const [experiences, setExperiences] = useState(initialExperiencesData.Experiences || []);
	const [education, setEducation] = useState(initialEducationData.Education || {});
	const [achievements, setAchievements] = useState(initialEducationData.Achievements || []);
	const [skills, setSkills] = useState(initialSkillsData.SkillCategories || []);
	const [profile, setProfile] = useState(initialProfileData.Profile || {});

	// Active Modal States
	const [activeProject, setActiveProject] = useState(null);
	const [activeExperience, setActiveExperience] = useState(null);
	const [activeAchievement, setActiveAchievement] = useState(null);
	const [activeSkill, setActiveSkill] = useState(null);

	const [isEditingProject, setIsEditingProject] = useState(false);
	const [isEditingExp, setIsEditingExp] = useState(false);
	const [isEditingAch, setIsEditingAch] = useState(false);
	const [isEditingSkill, setIsEditingSkill] = useState(false);

	const [isSaving, setIsSaving] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [statusMessage, setStatusMessage] = useState(null);

	// Protect route
	useEffect(() => {
		if (!loading && !isAdmin) {
			router.push("/login");
		}
	}, [loading, isAdmin, router]);

	if (loading || !isAdmin) {
		return (
			<div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center font-sans">
				<div className="flex items-center gap-3">
					<FontAwesomeIcon icon={faSpinner} className="animate-spin text-zinc-300 text-lg" />
					<span className="text-sm font-medium">Memuat Admin Portal...</span>
				</div>
			</div>
		);
	}

	// PROJECTS HANDLERS
	const handleSaveProjects = async (updatedList) => {
		setIsSaving(true); setStatusMessage(null);
		const listToSave = updatedList || projects;
		try {
			const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE_PROJECTS", data: { Projects: listToSave } }) });
			const result = await res.json(); if (!res.ok) throw new Error(result.error || "Gagal menyimpan project.");
			setStatusMessage({ type: "success", text: result.message || "Data project berhasil disimpan." });
		} catch (err) { setStatusMessage({ type: "error", text: err.message || "Terjadi kesalahan." }); }
		finally { setIsSaving(false); }
	};

	const handleToggleVisibility = (index) => {
		const updated = [...projects]; updated[index].show = !updated[index].show;
		setProjects(updated); handleSaveProjects(updated);
	};

	const handleDeleteProject = (index) => {
		if (confirm(`Hapus project "${projects[index].title}"?`)) {
			const updated = projects.filter((_, i) => i !== index); setProjects(updated); handleSaveProjects(updated);
		}
	};

	const handleSaveProjectForm = (e) => {
		e.preventDefault(); if (!activeProject.title || !activeProject.slug) return alert("Judul dan Slug wajib diisi.");
		const updated = [...projects]; const projectObj = { ...activeProject }; delete projectObj._index;
		if (activeProject._index >= 0) updated[activeProject._index] = projectObj; else updated.unshift(projectObj);
		setProjects(updated); setIsEditingProject(false); handleSaveProjects(updated);
	};

	// EXPERIENCES HANDLERS
	const handleSaveExperiences = async (updatedList) => {
		setIsSaving(true); setStatusMessage(null);
		const listToSave = updatedList || experiences;
		try {
			const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE_EXPERIENCES", data: { Experiences: listToSave } }) });
			const result = await res.json(); if (!res.ok) throw new Error(result.error || "Gagal menyimpan pengalaman.");
			setStatusMessage({ type: "success", text: result.message || "Data pengalaman berhasil disimpan." });
		} catch (err) { setStatusMessage({ type: "error", text: err.message || "Terjadi kesalahan." }); }
		finally { setIsSaving(false); }
	};

	const handleDeleteExp = (index) => {
		if (confirm(`Hapus pengalaman di "${experiences[index].company}"?`)) {
			const updated = experiences.filter((_, i) => i !== index); setExperiences(updated); handleSaveExperiences(updated);
		}
	};

	const handleSaveExpForm = (e) => {
		e.preventDefault(); if (!activeExperience.company || !activeExperience.position) return alert("Perusahaan dan Posisi wajib diisi.");
		const updated = [...experiences]; const expObj = { ...activeExperience }; delete expObj._index;
		if (activeExperience._index >= 0) updated[activeExperience._index] = expObj; else updated.unshift(expObj);
		setExperiences(updated); setIsEditingExp(false); handleSaveExperiences(updated);
	};

	// EDUCATION & ACHIEVEMENTS HANDLERS
	const handleSaveEducation = async (updatedEdu, updatedAch) => {
		setIsSaving(true); setStatusMessage(null);
		const eduToSave = updatedEdu || education; const achToSave = updatedAch || achievements;
		try {
			const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE_EDUCATION", data: { Education: eduToSave, Achievements: achToSave } }) });
			const result = await res.json(); if (!res.ok) throw new Error(result.error || "Gagal menyimpan pendidikan.");
			setStatusMessage({ type: "success", text: result.message || "Data pendidikan berhasil disimpan." });
		} catch (err) { setStatusMessage({ type: "error", text: err.message || "Terjadi kesalahan." }); }
		finally { setIsSaving(false); }
	};

	const handleDeleteAch = (index) => {
		if (confirm(`Hapus prestasi "${achievements[index].title}"?`)) {
			const updated = achievements.filter((_, i) => i !== index); setAchievements(updated); handleSaveEducation(education, updated);
		}
	};

	const handleSaveAchForm = (e) => {
		e.preventDefault(); if (!activeAchievement.title) return alert("Judul Prestasi wajib diisi.");
		const updated = [...achievements]; const achObj = { ...activeAchievement }; delete achObj._index;
		if (activeAchievement._index >= 0) updated[activeAchievement._index] = achObj; else updated.unshift(achObj);
		setAchievements(updated); setIsEditingAch(false); handleSaveEducation(education, updated);
	};

	// SKILLS HANDLERS
	const handleSaveSkills = async (updatedList) => {
		setIsSaving(true); setStatusMessage(null);
		const listToSave = updatedList || skills;
		try {
			const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE_SKILLS", data: { SkillCategories: listToSave } }) });
			const result = await res.json(); if (!res.ok) throw new Error(result.error || "Gagal menyimpan skills.");
			setStatusMessage({ type: "success", text: result.message || "Data skills berhasil disimpan." });
		} catch (err) { setStatusMessage({ type: "error", text: err.message || "Terjadi kesalahan." }); }
		finally { setIsSaving(false); }
	};

	const handleDeleteSkill = (index) => {
		if (confirm(`Hapus kategori skill "${skills[index].title}"?`)) {
			const updated = skills.filter((_, i) => i !== index); setSkills(updated); handleSaveSkills(updated);
		}
	};

	const handleSaveSkillForm = (e) => {
		e.preventDefault(); if (!activeSkill.title || !activeSkill.key) return alert("Judul dan Key Kategori wajib diisi.");
		const updated = [...skills]; const skillObj = { ...activeSkill }; delete skillObj._index;
		if (activeSkill._index >= 0) updated[activeSkill._index] = skillObj; else updated.push(skillObj);
		setSkills(updated); setIsEditingSkill(false); handleSaveSkills(updated);
	};

	// PROFILE HANDLERS
	const handleSaveProfile = async (updatedProf) => {
		setIsSaving(true); setStatusMessage(null);
		const profToSave = updatedProf || profile;
		try {
			const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPDATE_PROFILE", data: { Profile: profToSave } }) });
			const result = await res.json(); if (!res.ok) throw new Error(result.error || "Gagal menyimpan profil.");
			setStatusMessage({ type: "success", text: result.message || "Data profil & bio berhasil disimpan." });
		} catch (err) { setStatusMessage({ type: "error", text: err.message || "Terjadi kesalahan." }); }
		finally { setIsSaving(false); }
	};

	// Image Upload Handler (Supports thumbnail & gallery images)
	const handleFileUpload = async (e, targetField = "thumbnail") => {
		const file = e.target.files?.[0]; if (!file) return;
		if (!activeProject.slug) return alert("Mohon isi Slug Project terlebih dahulu.");
		setIsUploading(true);
		try {
			const reader = new FileReader();
			reader.onload = async () => {
				const base64Data = reader.result; const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`;
				const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "UPLOAD_IMAGE", image: { fileName, base64Data, slug: activeProject.slug } }) });
				const result = await res.json(); if (!res.ok) throw new Error(result.error || "Gagal mengunggah gambar.");
				
				if (targetField === "thumbnail") {
					setActiveProject((prev) => ({ ...prev, thumbnail: result.url }));
				} else if (targetField === "gallery") {
					setActiveProject((prev) => ({
						...prev,
						images: [...(prev.images || []), result.url],
					}));
				}
			};
			reader.readAsDataURL(file);
		} catch (err) { alert(`Upload Error: ${err.message}`); }
		finally { setIsUploading(false); }
	};

	return (
		<main className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-zinc-800">
			{/* Top Bar */}
			<header className="border-b border-zinc-900 bg-zinc-950/80 sticky top-0 z-30 backdrop-blur-md">
				<div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 font-medium">
							<FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" /> Portofolio
						</Link>
						<span className="text-zinc-800">|</span>
						<div className="flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
							<h1 className="text-sm font-semibold text-zinc-100 tracking-tight">Admin Portal</h1>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-xs text-zinc-400 font-mono hidden md:inline">{user?.email}</span>
						<button onClick={logout} className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 transition-all flex items-center gap-1.5 font-medium">
							<FontAwesomeIcon icon={faSignOutAlt} className="text-[11px]" /> Logout
						</button>
					</div>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
				{/* Tab Navigation */}
				<div className="w-full overflow-x-auto border-b border-zinc-900 pb-3 mb-6 flex items-center gap-2 scrollbar-none">
					<button onClick={() => setActiveTab("projects")} className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === "projects" ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"}`}>
						<FontAwesomeIcon icon={faFolderOpen} className="text-xs" /><span>Projects ({projects.length})</span>
					</button>

					<button onClick={() => setActiveTab("experiences")} className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === "experiences" ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"}`}>
						<FontAwesomeIcon icon={faBriefcase} className="text-xs" /><span>Pengalaman ({experiences.length})</span>
					</button>

					<button onClick={() => setActiveTab("education")} className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === "education" ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"}`}>
						<FontAwesomeIcon icon={faGraduationCap} className="text-xs" /><span>Pendidikan ({achievements.length})</span>
					</button>

					<button onClick={() => setActiveTab("skills")} className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === "skills" ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"}`}>
						<FontAwesomeIcon icon={faCode} className="text-xs" /><span>Skills ({skills.length})</span>
					</button>

					<button onClick={() => setActiveTab("profile")} className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === "profile" ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"}`}>
						<FontAwesomeIcon icon={faUser} className="text-xs" /><span>Bio & Profile</span>
					</button>
				</div>

				{/* Notification Banner */}
				{statusMessage && (
					<motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 p-4 rounded-xl border text-xs flex items-center justify-between ${statusMessage.type === "success" ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-red-950/20 border-red-900/40 text-red-300"}`}>
						<div className="flex items-center gap-2.5">
							<FontAwesomeIcon icon={statusMessage.type === "success" ? faCheckCircle : faExclamationCircle} className={statusMessage.type === "success" ? "text-zinc-400" : "text-red-400"} />
							<span>{statusMessage.text}</span>
						</div>
						<button onClick={() => setStatusMessage(null)} className="text-zinc-500 hover:text-zinc-300 text-[11px]">Tutup</button>
					</motion.div>
				)}

				{/* TAB 1: PROJECTS */}
				{activeTab === "projects" && (
					<div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
							<div>
								<h2 className="text-base font-semibold text-zinc-100">Project Showcase Management</h2>
								<p className="text-xs text-zinc-500 mt-0.5">Kelola karya project, galeri foto, deskripsi, tech stack, dan link.</p>
							</div>
							<div className="flex items-center gap-2">
								<button onClick={() => { setActiveProject({ show: true, title: "", desc: ["", ""], year: new Date().getFullYear().toString(), preview: "", code: "", thumbnail: "", images: [], tech: [], slug: "", category: [1], _index: -1 }); setIsEditingProject(true); }} className="text-xs font-medium bg-zinc-100 text-zinc-950 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
									<FontAwesomeIcon icon={faPlus} className="text-[11px]" /> Tambah Project
								</button>
								<button onClick={() => handleSaveProjects()} disabled={isSaving} className="text-xs font-medium bg-zinc-900 text-zinc-200 px-3.5 py-2 rounded-lg border border-zinc-800 flex items-center gap-1.5 disabled:opacity-50">
									<FontAwesomeIcon icon={isSaving ? faSpinner : faSave} className={isSaving ? "animate-spin" : ""} />
									<span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{projects.map((proj, idx) => (
								<motion.div
									key={proj.slug || idx}
									initial={{ opacity: 0, y: 15 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.35, delay: idx * 0.05 }}
									className={`bg-zinc-900/60 border rounded-xl p-4 flex flex-col justify-between ${proj.show ? "border-zinc-800/80 hover:border-zinc-700" : "border-zinc-900/60 opacity-50 bg-zinc-950/40"}`}>
									<div>
										<div className="flex items-start justify-between gap-2 mb-2.5">
											<h3 className="font-medium text-zinc-200 text-sm truncate">{proj.title}</h3>
											<span className="text-[10px] text-zinc-400 font-mono bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-800">{proj.year}</span>
										</div>
										{proj.thumbnail ? (
											<div className="w-full h-32 bg-zinc-950 rounded-lg overflow-hidden mb-3 border border-zinc-800/60 relative">
												<img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover opacity-90" />
												<span className="absolute bottom-2 right-2 text-[10px] bg-zinc-950/80 text-zinc-300 font-mono px-2 py-0.5 rounded border border-zinc-800">
													📷 {proj.images?.length || 1} Foto
												</span>
											</div>
										) : (
											<div className="w-full h-32 bg-zinc-950/80 rounded-lg mb-3 flex items-center justify-center text-zinc-700 border border-zinc-900"><FontAwesomeIcon icon={faImage} className="text-xl" /></div>
										)}
										<p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">{Array.isArray(proj.desc) ? proj.desc[0] : proj.desc}</p>
										<div className="flex flex-wrap gap-1 mb-4">{proj.tech?.slice(0, 4).map((t, i) => (<span key={i} className="text-[10px] bg-zinc-800/70 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">{t}</span>))}</div>
									</div>
									<div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
										<button onClick={() => handleToggleVisibility(idx)} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium ${proj.show ? "text-zinc-300 bg-zinc-800/80" : "text-zinc-500 bg-zinc-900"}`}>
											<FontAwesomeIcon icon={proj.show ? faEye : faEyeSlash} className="text-[10px]" /><span>{proj.show ? "Publik" : "Draft"}</span>
										</button>
										<div className="flex items-center gap-1.5">
											<button onClick={() => { setActiveProject({ ...proj, _index: idx }); setIsEditingProject(true); }} className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded flex items-center gap-1 text-xs">
												<FontAwesomeIcon icon={faEdit} className="text-xs" /> <span>Edit</span>
											</button>
											<button onClick={() => handleDeleteProject(idx)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded"><FontAwesomeIcon icon={faTrash} className="text-xs" /></button>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				)}

				{/* TAB 2: PENGALAMAN KERJA */}
				{activeTab === "experiences" && (
					<div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
							<div>
								<h2 className="text-base font-semibold text-zinc-100">Professional Experience Timeline</h2>
								<p className="text-xs text-zinc-500 mt-0.5">Kelola riwayat karir, organisasi, dan tanggung jawab kerja.</p>
							</div>
							<div className="flex items-center gap-2">
								<button onClick={() => { setActiveExperience({ id: Date.now(), startDate: "", endDate: "Present", company: "", position: "", type: "Full-time", location: "", description: "", skills: [], _index: -1 }); setIsEditingExp(true); }} className="text-xs font-medium bg-zinc-100 text-zinc-950 px-3.5 py-2 rounded-lg flex items-center gap-1.5">
									<FontAwesomeIcon icon={faPlus} className="text-[11px]" /> Tambah Pengalaman
								</button>
								<button onClick={() => handleSaveExperiences()} disabled={isSaving} className="text-xs font-medium bg-zinc-900 text-zinc-200 px-3.5 py-2 rounded-lg border border-zinc-800 flex items-center gap-1.5 disabled:opacity-50">
									<FontAwesomeIcon icon={isSaving ? faSpinner : faSave} className={isSaving ? "animate-spin" : ""} /><span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
								</button>
							</div>
						</div>

						<div className="space-y-3">
							{experiences.map((exp, idx) => (
								<motion.div
									key={exp.id || idx}
									initial={{ opacity: 0, y: 15 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.35, delay: idx * 0.05 }}
									className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
									<div className="space-y-1.5 max-w-2xl">
										<div className="flex items-center gap-2.5 flex-wrap"><h3 className="font-semibold text-zinc-100 text-sm">{exp.position}</h3><span className="text-xs text-zinc-400 font-medium">@ {exp.company}</span><span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/60 font-mono">{exp.type}</span></div>
										<p className="text-xs text-zinc-500 font-mono">📅 {exp.startDate} - {exp.endDate} | 📍 {exp.location}</p>
										<p className="text-xs text-zinc-400 leading-relaxed">{exp.description}</p>
										<div className="flex flex-wrap gap-1.5 pt-1">{exp.skills?.map((sk, i) => (<span key={i} className="text-[10px] bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">{sk}</span>))}</div>
									</div>
									<div className="flex items-center gap-2 self-end md:self-center">
										<button onClick={() => { setActiveExperience({ ...exp, _index: idx }); setIsEditingExp(true); }} className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded text-xs flex items-center gap-1 border border-zinc-800"><FontAwesomeIcon icon={faEdit} /><span>Edit</span></button>
										<button onClick={() => handleDeleteExp(idx)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded text-xs flex items-center gap-1 border border-zinc-800"><FontAwesomeIcon icon={faTrash} /><span>Hapus</span></button>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				)}

				{/* TAB 3: PENDIDIKAN & AWARDS */}
				{activeTab === "education" && (
					<div className="space-y-8">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<h2 className="text-base font-semibold text-zinc-100">Education & Achievements</h2>
								<p className="text-xs text-zinc-500 mt-0.5">Kelola latar belakang pendidikan utama dan daftar prestasi/penghargaan.</p>
							</div>
							<button onClick={() => handleSaveEducation()} disabled={isSaving} className="text-xs font-medium bg-zinc-900 text-zinc-200 px-3.5 py-2 rounded-lg border border-zinc-800 flex items-center gap-1.5 disabled:opacity-50">
								<FontAwesomeIcon icon={isSaving ? faSpinner : faSave} className={isSaving ? "animate-spin" : ""} /><span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
							</button>
						</div>

						<motion.div
							initial={{ opacity: 0, y: 15 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.35 }}
							className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-4">
							<h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2"><FontAwesomeIcon icon={faGraduationCap} className="text-zinc-400" />Latar Belakang Pendidikan Utama</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Institusi / Kampus</label><input type="text" value={education.institution || ""} onChange={(e) => setEducation({ ...education, institution: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Jurusan / Program Studi</label><input type="text" value={education.major || ""} onChange={(e) => setEducation({ ...education, major: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Periode Studi</label><input type="text" value={education.period || ""} onChange={(e) => setEducation({ ...education, period: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Estimasi Lulus</label><input type="text" value={education.expectedGraduation || ""} onChange={(e) => setEducation({ ...education, expectedGraduation: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Kegiatan / Organisasi Kampus</label><input type="text" value={education.activities || ""} onChange={(e) => setEducation({ ...education, activities: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
							</div>
							<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Deskripsi & Perjalanan Studi (per paragraf)</label><textarea rows={4} value={Array.isArray(education.description) ? education.description.join("\n\n") : education.description || ""} onChange={(e) => setEducation({ ...education, description: e.target.value.split("\n\n").filter(Boolean) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none leading-relaxed" /></div>
						</motion.div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2"><FontAwesomeIcon icon={faTrophy} className="text-zinc-400" />Daftar Prestasi & Sertifikasi ({achievements.length})</h3>
								<button onClick={() => { setActiveAchievement({ id: Date.now(), year: new Date().getFullYear().toString(), title: "", subtitle: "", date: "", iconType: "trophy", _index: -1 }); setIsEditingAch(true); }} className="text-xs font-medium bg-zinc-100 text-zinc-950 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Tambah Prestasi</button>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{achievements.map((ach, idx) => (
									<motion.div
										key={ach.id || idx}
										initial={{ opacity: 0, y: 15 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.35, delay: idx * 0.05 }}
										className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex items-center justify-between gap-3">
										<div className="space-y-1"><span className="text-[10px] bg-zinc-800 font-mono px-2 py-0.5 rounded text-zinc-300 border border-zinc-700/60">{ach.year}</span><h4 className="font-semibold text-zinc-100 text-xs">{ach.title}</h4><p className="text-[11px] text-zinc-400">{ach.subtitle}</p><p className="text-[10px] text-zinc-500">{ach.date}</p></div>
										<div className="flex items-center gap-1">
											<button onClick={() => { setActiveAchievement({ ...ach, _index: idx }); setIsEditingAch(true); }} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded"><FontAwesomeIcon icon={faEdit} /></button>
											<button onClick={() => handleDeleteAch(idx)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded"><FontAwesomeIcon icon={faTrash} /></button>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* TAB 4: TECHNICAL SKILLS */}
				{activeTab === "skills" && (
					<div className="space-y-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<h2 className="text-base font-semibold text-zinc-100">Technical Skills & Categories</h2>
								<p className="text-xs text-zinc-500 mt-0.5">Kelola kategori keahlian, daftar bahasa pemrograman, framework, dan tools.</p>
							</div>
							<div className="flex items-center gap-2">
								<button onClick={() => { setActiveSkill({ key: "new-category", title: "", iconType: "web", description: "", languages: [], tools: [], _index: -1 }); setIsEditingSkill(true); }} className="text-xs font-medium bg-zinc-100 text-zinc-950 px-3.5 py-2 rounded-lg flex items-center gap-1.5"><FontAwesomeIcon icon={faPlus} className="text-[11px]" /> Tambah Kategori</button>
								<button onClick={() => handleSaveSkills()} disabled={isSaving} className="text-xs font-medium bg-zinc-900 text-zinc-200 px-3.5 py-2 rounded-lg border border-zinc-800 flex items-center gap-1.5 disabled:opacity-50"><FontAwesomeIcon icon={isSaving ? faSpinner : faSave} className={isSaving ? "animate-spin" : ""} /><span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span></button>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{skills.map((sk, idx) => (
								<motion.div
									key={sk.key || idx}
									initial={{ opacity: 0, y: 15 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.35, delay: idx * 0.05 }}
									className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 space-y-3">
									<div className="flex items-start justify-between gap-2">
										<div><div className="flex items-center gap-2"><span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono px-2 py-0.5 rounded border border-zinc-700">{sk.key}</span><h3 className="font-semibold text-zinc-100 text-sm">{sk.title}</h3></div><p className="text-xs text-zinc-400 mt-1">{sk.description}</p></div>
										<div className="flex items-center gap-1">
											<button onClick={() => { setActiveSkill({ ...sk, _index: idx }); setIsEditingSkill(true); }} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded"><FontAwesomeIcon icon={faEdit} /></button>
											<button onClick={() => handleDeleteSkill(idx)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded"><FontAwesomeIcon icon={faTrash} /></button>
										</div>
									</div>
									<div className="space-y-2 pt-2 border-t border-zinc-800/60">
										<div><span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Languages:</span><div className="flex flex-wrap gap-1">{sk.languages?.map((lang, i) => (<span key={i} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/60">{lang}</span>))}</div></div>
										<div><span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Tools:</span><div className="flex flex-wrap gap-1">{sk.tools?.map((tl, i) => (<span key={i} className="text-[10px] bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">{tl}</span>))}</div></div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				)}

				{/* TAB 5: BIO & PROFILE */}
				{activeTab === "profile" && (
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.35 }}
						className="space-y-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<h2 className="text-base font-semibold text-zinc-100">Personal Profile, Bio & Links</h2>
								<p className="text-xs text-zinc-500 mt-0.5">Kelola identitas diri, kata-kata quote di halaman utama, email kontak, dan tautan sosial media.</p>
							</div>

							<button
								onClick={() => handleSaveProfile()}
								disabled={isSaving}
								className="text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-3.5 py-2 rounded-lg border border-zinc-800 flex items-center gap-1.5 disabled:opacity-50">
								<FontAwesomeIcon icon={isSaving ? faSpinner : faSave} className={isSaving ? "animate-spin" : ""} />
								<span>{isSaving ? "Menyimpan..." : "Simpan Profile"}</span>
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-4">
								<h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
									<FontAwesomeIcon icon={faUser} className="text-zinc-400" />
									Identitas Utama & Tagline
								</h3>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Nama Lengkap</label><input type="text" value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Nama Panggilan / Brand</label><input type="text" value={profile.nickname || ""} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Headline Utama (Role)</label><input type="text" value={profile.headline || ""} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Sub-headline (Spesialisasi)</label><input type="text" value={profile.subheadline || ""} onChange={(e) => setProfile({ ...profile, subheadline: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Domisili / Lokasi</label><input type="text" value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
							</div>

							<div className="space-y-6">
								<div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-4">
									<h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
										<FontAwesomeIcon icon={faQuoteLeft} className="text-zinc-400" />
										Quote Halaman Utama (Interaktif)
									</h3>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Quote Baris 1 (Teks Hitam)</label><input type="text" value={profile.quoteLine1 || ""} onChange={(e) => setProfile({ ...profile, quoteLine1: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Quote Baris 2 (Teks Abu-abu)</label><input type="text" value={profile.quoteLine2 || ""} onChange={(e) => setProfile({ ...profile, quoteLine2: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								</div>

								<div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-4">
									<h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
										<FontAwesomeIcon icon={faLink} className="text-zinc-400" />
										Tautan Kontak & Sosial Media
									</h3>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Email Kontak</label><input type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">URL GitHub</label><input type="text" value={profile.githubUrl || ""} onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none font-mono" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">URL LinkedIn</label><input type="text" value={profile.linkedinUrl || ""} onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none font-mono" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">URL Resume PDF</label><input type="text" value={profile.resumeUrl || ""} onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none font-mono" /></div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</div>

			{/* EDIT PROJECT MODAL WITH MULTI-IMAGE GALLERY MANAGER */}
			<AnimatePresence>
				{isEditingProject && activeProject && (
					<div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
						<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
							<div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
								<h3 className="text-sm font-semibold text-zinc-100">{activeProject._index >= 0 ? `Edit Project: ${activeProject.title}` : "Tambah Project Baru"}</h3>
								<button onClick={() => setIsEditingProject(false)} className="text-zinc-500 hover:text-zinc-300 text-sm">✕</button>
							</div>
							<form onSubmit={handleSaveProjectForm} className="space-y-5">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Judul Project *</label><input type="text" required value={activeProject.title} onChange={(e) => setActiveProject({ ...activeProject, title: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Slug (URL) *</label><input type="text" required value={activeProject.slug} onChange={(e) => setActiveProject({ ...activeProject, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono outline-none" /></div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Tahun</label><input type="text" value={activeProject.year} onChange={(e) => setActiveProject({ ...activeProject, year: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Status Visibilitas</label><select value={activeProject.show ? "true" : "false"} onChange={(e) => setActiveProject({ ...activeProject, show: e.target.value === "true" })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none"><option value="true">Tampilkan di Situs</option><option value="false">Sembunyikan (Draft)</option></select></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Kategori ID (e.g. 1, 2)</label><input type="text" value={activeProject.category?.join(", ") || "1"} onChange={(e) => setActiveProject({ ...activeProject, category: e.target.value.split(",").map((c) => parseInt(c.trim())).filter((n) => !isNaN(n)) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono outline-none" /></div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Link Preview Live (Opsional)</label><input type="text" value={activeProject.preview || ""} onChange={(e) => setActiveProject({ ...activeProject, preview: e.target.value })} placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Link Code Repository (Opsional)</label><input type="text" value={activeProject.code || ""} onChange={(e) => setActiveProject({ ...activeProject, code: e.target.value })} placeholder="https://github.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono outline-none" /></div>
								</div>

								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Deskripsi Paragraf 1 (Ringkasan Singkat)</label><textarea rows={2} value={Array.isArray(activeProject.desc) ? activeProject.desc[0] || "" : activeProject.desc} onChange={(e) => { const descArray = Array.isArray(activeProject.desc) ? [...activeProject.desc] : [activeProject.desc, ""]; descArray[0] = e.target.value; setActiveProject({ ...activeProject, desc: descArray }); }} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>

								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Deskripsi Paragraf 2 (Detail Teknis & Peran)</label><textarea rows={3} value={Array.isArray(activeProject.desc) ? activeProject.desc[1] || "" : ""} onChange={(e) => { const descArray = Array.isArray(activeProject.desc) ? [...activeProject.desc] : [activeProject.desc, ""]; descArray[1] = e.target.value; setActiveProject({ ...activeProject, desc: descArray }); }} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>

								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Tech Stack (pisahkan koma)</label><input type="text" value={activeProject.tech?.join(", ") || ""} onChange={(e) => setActiveProject({ ...activeProject, tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>

								{/* THUMBNAIL MANAGER */}
								<div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-xl space-y-3">
									<label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Foto Cover Utama (Thumbnail)</label>
									<div className="flex flex-col sm:flex-row items-center gap-3">
										{activeProject.thumbnail ? (
											<img src={activeProject.thumbnail} alt="Thumbnail Preview" className="w-20 h-14 object-cover rounded-lg border border-zinc-800 shrink-0" />
										) : (
											<div className="w-20 h-14 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-600 shrink-0"><FontAwesomeIcon icon={faImage} /></div>
										)}
										<input type="text" value={activeProject.thumbnail || ""} onChange={(e) => setActiveProject({ ...activeProject, thumbnail: e.target.value })} className="flex-1 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 outline-none" />
										<label className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 px-3.5 py-2 rounded-lg border border-zinc-700 cursor-pointer shrink-0 w-full sm:w-auto">
											<FontAwesomeIcon icon={isUploading ? faSpinner : faUpload} className={`text-[11px] ${isUploading ? "animate-spin" : ""}`} />
											<span>Upload Cover</span>
											<input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "thumbnail")} className="hidden" />
										</label>
									</div>
								</div>

								{/* MULTI-IMAGE GALLERY MANAGER */}
								<div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-xl space-y-3">
									<div className="flex items-center justify-between">
										<label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">Daftar Foto Galeri Project ({activeProject.images?.length || 0})</label>
										<label className="flex items-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer shadow-sm">
											<FontAwesomeIcon icon={isUploading ? faSpinner : faPlus} className={`text-[10px] ${isUploading ? "animate-spin" : ""}`} />
											<span>+ Tambah Foto Galeri</span>
											<input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "gallery")} className="hidden" />
										</label>
									</div>

									<div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
										{activeProject.images?.map((imgUrl, imgIdx) => (
											<div key={imgIdx} className="flex items-center gap-3 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
												<img src={imgUrl} alt={`Gallery ${imgIdx + 1}`} className="w-12 h-10 object-cover rounded border border-zinc-800 shrink-0" />
												<input
													type="text"
													value={imgUrl}
													onChange={(e) => {
														const newImgs = [...activeProject.images];
														newImgs[imgIdx] = e.target.value;
														setActiveProject({ ...activeProject, images: newImgs });
													}}
													className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-300 outline-none min-w-0"
												/>

												<div className="flex items-center gap-1 shrink-0">
													<button
														type="button"
														title="Set sebagai Thumbnail Utama"
														onClick={() => setActiveProject({ ...activeProject, thumbnail: imgUrl })}
														className={`p-1.5 rounded text-xs transition-colors ${activeProject.thumbnail === imgUrl ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"}`}>
														<FontAwesomeIcon icon={faStar} />
													</button>
													<button
														type="button"
														title="Hapus foto ini"
														onClick={() => {
															const newImgs = activeProject.images.filter((_, i) => i !== imgIdx);
															setActiveProject({ ...activeProject, images: newImgs });
														}}
														className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded text-xs transition-colors">
														<FontAwesomeIcon icon={faTrash} />
													</button>
												</div>
											</div>
										))}

										{(!activeProject.images || activeProject.images.length === 0) && (
											<p className="text-xs text-zinc-500 italic text-center py-2">Belum ada foto galeri tambahan.</p>
										)}
									</div>
								</div>

								<div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
									<button type="button" onClick={() => setIsEditingProject(false)} className="px-3.5 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Batal</button>
									<button type="submit" className="px-4 py-1.5 bg-zinc-100 text-zinc-950 font-medium rounded-lg text-xs">Simpan Project</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* EDIT EXPERIENCE MODAL */}
			<AnimatePresence>
				{isEditingExp && activeExperience && (
					<div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
						<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
							<div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
								<h3 className="text-sm font-semibold text-zinc-100">{activeExperience._index >= 0 ? `Edit Pengalaman: ${activeExperience.company}` : "Tambah Pengalaman Kerja Baru"}</h3>
								<button onClick={() => setIsEditingExp(false)} className="text-zinc-500 hover:text-zinc-300 text-sm">✕</button>
							</div>
							<form onSubmit={handleSaveExpForm} className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Nama Perusahaan / Organisasi *</label><input type="text" required value={activeExperience.company} onChange={(e) => setActiveExperience({ ...activeExperience, company: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Jabatan / Position *</label><input type="text" required value={activeExperience.position} onChange={(e) => setActiveExperience({ ...activeExperience, position: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Tipe Pekerjaan</label><select value={activeExperience.type} onChange={(e) => setActiveExperience({ ...activeExperience, type: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none"><option value="Full-time">Full-time</option><option value="Freelance">Freelance</option><option value="Internship">Internship</option><option value="Part-time">Part-time</option></select></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Tanggal Mulai</label><input type="text" value={activeExperience.startDate} onChange={(e) => setActiveExperience({ ...activeExperience, startDate: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Tanggal Selesai</label><input type="text" value={activeExperience.endDate} onChange={(e) => setActiveExperience({ ...activeExperience, endDate: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								</div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Lokasi</label><input type="text" value={activeExperience.location} onChange={(e) => setActiveExperience({ ...activeExperience, location: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Deskripsi Tugas & Pencapaian</label><textarea rows={3} value={activeExperience.description} onChange={(e) => setActiveExperience({ ...activeExperience, description: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Skills & Tools Terkait (pisahkan koma)</label><input type="text" value={activeExperience.skills?.join(", ") || ""} onChange={(e) => setActiveExperience({ ...activeExperience, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div className="pt-3 border-t border-zinc-800 flex justify-end gap-2"><button type="button" onClick={() => setIsEditingExp(false)} className="px-3.5 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Batal</button><button type="submit" className="px-4 py-1.5 bg-zinc-100 text-zinc-950 font-medium rounded-lg text-xs">Simpan Pengalaman</button></div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* EDIT ACHIEVEMENT MODAL */}
			<AnimatePresence>
				{isEditingAch && activeAchievement && (
					<div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
						<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 shadow-2xl">
							<div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
								<h3 className="text-sm font-semibold text-zinc-100">{activeAchievement._index >= 0 ? `Edit Prestasi: ${activeAchievement.title}` : "Tambah Prestasi Baru"}</h3>
								<button onClick={() => setIsEditingAch(false)} className="text-zinc-500 hover:text-zinc-300 text-sm">✕</button>
							</div>
							<form onSubmit={handleSaveAchForm} className="space-y-3.5">
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Judul Prestasi / Sertifikasi *</label><input type="text" required value={activeAchievement.title} onChange={(e) => setActiveAchievement({ ...activeAchievement, title: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Penyelenggara / Detail Subtitle</label><input type="text" value={activeAchievement.subtitle} onChange={(e) => setActiveAchievement({ ...activeAchievement, subtitle: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div className="grid grid-cols-2 gap-3">
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Tahun</label><input type="text" value={activeAchievement.year} onChange={(e) => setActiveAchievement({ ...activeAchievement, year: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Bulan / Tanggal</label><input type="text" value={activeAchievement.date} onChange={(e) => setActiveAchievement({ ...activeAchievement, date: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								</div>
								<div className="pt-3 border-t border-zinc-800 flex justify-end gap-2"><button type="button" onClick={() => setIsEditingAch(false)} className="px-3.5 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Batal</button><button type="submit" className="px-4 py-1.5 bg-zinc-100 text-zinc-950 font-medium rounded-lg text-xs">Simpan Prestasi</button></div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* EDIT SKILL CATEGORY MODAL */}
			<AnimatePresence>
				{isEditingSkill && activeSkill && (
					<div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
						<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 shadow-2xl">
							<div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
								<h3 className="text-sm font-semibold text-zinc-100">{activeSkill._index >= 0 ? `Edit Skill: ${activeSkill.title}` : "Tambah Kategori Skill Baru"}</h3>
								<button onClick={() => setIsEditingSkill(false)} className="text-zinc-500 hover:text-zinc-300 text-sm">✕</button>
							</div>
							<form onSubmit={handleSaveSkillForm} className="space-y-3.5">
								<div className="grid grid-cols-2 gap-3">
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Key Identifikasi *</label><input type="text" required value={activeSkill.key} onChange={(e) => setActiveSkill({ ...activeSkill, key: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono outline-none" /></div>
									<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Ikon Kategori</label><select value={activeSkill.iconType || "web"} onChange={(e) => setActiveSkill({ ...activeSkill, iconType: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none"><option value="web">Web / Full Stack</option><option value="api">API / Backend</option><option value="iot">IoT & Embedded</option><option value="robotics">Robotics</option></select></div>
								</div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Judul Kategori *</label><input type="text" required value={activeSkill.title} onChange={(e) => setActiveSkill({ ...activeSkill, title: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Deskripsi Kategori</label><input type="text" value={activeSkill.description} onChange={(e) => setActiveSkill({ ...activeSkill, description: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Languages & Frameworks (pisahkan koma)</label><textarea rows={2} value={activeSkill.languages?.join(", ") || ""} onChange={(e) => setActiveSkill({ ...activeSkill, languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div><label className="block text-[11px] font-medium text-zinc-400 mb-1">Tools & Environment (pisahkan koma)</label><textarea rows={2} value={activeSkill.tools?.join(", ") || ""} onChange={(e) => setActiveSkill({ ...activeSkill, tools: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none" /></div>
								<div className="pt-3 border-t border-zinc-800 flex justify-end gap-2"><button type="button" onClick={() => setIsEditingSkill(false)} className="px-3.5 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs">Batal</button><button type="submit" className="px-4 py-1.5 bg-zinc-100 text-zinc-950 font-medium rounded-lg text-xs">Simpan Kategori Skill</button></div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</main>
	);
}
