"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import initialProjectsData from "@/json/data.json";

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
	faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function AdminPage() {
	const { user, isAdmin, loading, logout } = useAuth();
	const router = useRouter();

	const [projects, setProjects] = useState(initialProjectsData.Projects || []);
	const [activeProject, setActiveProject] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
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

	const handleSaveAll = async (updatedProjectsList) => {
		setIsSaving(true);
		setStatusMessage(null);
		const listToSave = updatedProjectsList || projects;

		try {
			const res = await fetch("/api/admin/projects", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "UPDATE_PROJECTS",
					data: { Projects: listToSave },
				}),
			});

			const result = await res.json();
			if (!res.ok) throw new Error(result.error || "Gagal menyimpan data project");

			setStatusMessage({
				type: "success",
				text: result.message || "Perubahan berhasil disimpan.",
			});
		} catch (err) {
			console.error(err);
			setStatusMessage({
				type: "error",
				text: err.message || "Terjadi kesalahan saat menyimpan.",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleToggleVisibility = (index) => {
		const updated = [...projects];
		updated[index].show = !updated[index].show;
		setProjects(updated);
		handleSaveAll(updated);
	};

	const handleDeleteProject = (index) => {
		if (confirm(`Hapus project "${projects[index].title}"?`)) {
			const updated = projects.filter((_, i) => i !== index);
			setProjects(updated);
			handleSaveAll(updated);
		}
	};

	const handleEditOpen = (proj, index) => {
		setActiveProject({ ...proj, _index: index });
		setIsEditing(true);
	};

	const handleCreateOpen = () => {
		setActiveProject({
			show: true,
			title: "",
			desc: ["", ""],
			year: new Date().getFullYear().toString(),
			preview: "",
			code: "",
			thumbnail: "",
			images: [],
			tech: [],
			slug: "",
			category: [1],
			_index: -1,
		});
		setIsEditing(true);
	};

	const handleSaveForm = (e) => {
		e.preventDefault();
		if (!activeProject.title || !activeProject.slug) {
			alert("Judul dan Slug wajib diisi.");
			return;
		}

		const updated = [...projects];
		const projectObj = { ...activeProject };
		delete projectObj._index;

		if (activeProject._index >= 0) {
			updated[activeProject._index] = projectObj;
		} else {
			updated.unshift(projectObj);
		}

		setProjects(updated);
		setIsEditing(false);
		handleSaveAll(updated);
	};

	const handleFileUpload = async (e, targetField = "thumbnail") => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!activeProject.slug) {
			alert("Mohon isi Slug Project terlebih dahulu.");
			return;
		}

		setIsUploading(true);
		try {
			const reader = new FileReader();
			reader.onload = async () => {
				const base64Data = reader.result;
				const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "-")}`;

				const res = await fetch("/api/admin/projects", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						action: "UPLOAD_IMAGE",
						image: {
							fileName,
							base64Data,
							slug: activeProject.slug,
						},
					}),
				});

				const result = await res.json();
				if (!res.ok) throw new Error(result.error || "Gagal mengunggah gambar.");

				const uploadedUrl = result.url;
				if (targetField === "thumbnail") {
					setActiveProject((prev) => ({ ...prev, thumbnail: uploadedUrl }));
				} else if (targetField === "gallery") {
					setActiveProject((prev) => ({
						...prev,
						images: [...(prev.images || []), uploadedUrl],
					}));
				}
			};
			reader.readAsDataURL(file);
		} catch (err) {
			console.error(err);
			alert(`Upload Error: ${err.message}`);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<main className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-zinc-800">
			{/* Top Bar Navigation */}
			<header className="border-b border-zinc-900 bg-zinc-950/80 sticky top-0 z-30 backdrop-blur-md">
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 font-medium">
							<FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" /> Portofolio
						</Link>
						<span className="text-zinc-800">|</span>
						<div className="flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
							<h1 className="text-sm font-semibold text-zinc-100 tracking-tight">Admin Dashboard</h1>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-xs text-zinc-400 font-mono hidden md:inline">{user?.email}</span>
						<button
							onClick={logout}
							className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 transition-all flex items-center gap-1.5 font-medium">
							<FontAwesomeIcon icon={faSignOutAlt} className="text-[11px]" /> Logout
						</button>
					</div>
				</div>
			</header>

			<div className="max-w-6xl mx-auto px-6 py-8">
				{/* Notification Banner */}
				{statusMessage && (
					<motion.div
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						className={`mb-6 p-4 rounded-xl border text-xs flex items-center justify-between ${
							statusMessage.type === "success"
								? "bg-zinc-900 border-zinc-800 text-zinc-200"
								: "bg-red-950/20 border-red-900/40 text-red-300"
						}`}>
						<div className="flex items-center gap-2.5">
							<FontAwesomeIcon
								icon={statusMessage.type === "success" ? faCheckCircle : faExclamationCircle}
								className={statusMessage.type === "success" ? "text-zinc-400" : "text-red-400"}
							/>
							<span>{statusMessage.text}</span>
						</div>
						<button onClick={() => setStatusMessage(null)} className="text-zinc-500 hover:text-zinc-300 text-[11px]">
							Tutup
						</button>
					</motion.div>
				)}

				{/* Header Actions & Title */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
					<div>
						<h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
							<FontAwesomeIcon icon={faFolderOpen} className="text-zinc-500 text-sm" />
							Project Management ({projects.length})
						</h2>
						<p className="text-xs text-zinc-500 mt-0.5">
							Kelola data project, urutan, status publikasi, dan file gambar.
						</p>
					</div>

					<div className="flex items-center gap-2.5">
						<button
							onClick={handleCreateOpen}
							className="text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95">
							<FontAwesomeIcon icon={faPlus} className="text-[11px]" /> Tambah Project
						</button>

						<button
							onClick={() => handleSaveAll()}
							disabled={isSaving}
							className="text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-3.5 py-2 rounded-lg border border-zinc-800 transition-all flex items-center gap-1.5 disabled:opacity-50">
							<FontAwesomeIcon icon={isSaving ? faSpinner : faSave} className={isSaving ? "animate-spin" : ""} />
							<span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
						</button>
					</div>
				</div>

				{/* Projects Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{projects.map((proj, idx) => (
						<motion.div
							key={proj.slug || idx}
							layout
							className={`bg-zinc-900/60 border rounded-xl p-4 flex flex-col justify-between transition-all ${
								proj.show
									? "border-zinc-800/80 hover:border-zinc-700"
									: "border-zinc-900/60 opacity-50 bg-zinc-950/40"
							}`}>
							<div>
								{/* Card Top */}
								<div className="flex items-start justify-between gap-2 mb-2.5">
									<h3 className="font-medium text-zinc-200 text-sm truncate">{proj.title}</h3>
									<span className="text-[10px] text-zinc-400 font-mono bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-800">
										{proj.year}
									</span>
								</div>

								{/* Thumbnail Preview */}
								{proj.thumbnail ? (
									<div className="w-full h-32 bg-zinc-950 rounded-lg overflow-hidden mb-3 border border-zinc-800/60 relative">
										<img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover opacity-90" />
									</div>
								) : (
									<div className="w-full h-32 bg-zinc-950/80 rounded-lg mb-3 flex items-center justify-center text-zinc-700 border border-zinc-900">
										<FontAwesomeIcon icon={faImage} className="text-xl" />
									</div>
								)}

								<p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
									{Array.isArray(proj.desc) ? proj.desc[0] : proj.desc}
								</p>

								{/* Tech Tags */}
								<div className="flex flex-wrap gap-1 mb-4">
									{proj.tech?.slice(0, 4).map((t, i) => (
										<span key={i} className="text-[10px] bg-zinc-800/70 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
											{t}
										</span>
									))}
									{proj.tech?.length > 4 && (
										<span className="text-[10px] text-zinc-500 self-center">+{proj.tech.length - 4}</span>
									)}
								</div>
							</div>

							{/* Card Bottom Actions */}
							<div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
								<button
									onClick={() => handleToggleVisibility(idx)}
									className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors text-[11px] font-medium ${
										proj.show
											? "text-zinc-300 bg-zinc-800/80 hover:bg-zinc-800"
											: "text-zinc-500 bg-zinc-900 hover:bg-zinc-850"
									}`}>
									<FontAwesomeIcon icon={proj.show ? faEye : faEyeSlash} className="text-[10px]" />
									<span>{proj.show ? "Publik" : "Draft"}</span>
								</button>

								<div className="flex items-center gap-1.5">
									<button
										onClick={() => handleEditOpen(proj, idx)}
										className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
										title="Edit Project">
										<FontAwesomeIcon icon={faEdit} className="text-xs" />
									</button>
									<button
										onClick={() => handleDeleteProject(idx)}
										className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
										title="Hapus Project">
										<FontAwesomeIcon icon={faTrash} className="text-xs" />
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			{/* EDIT / CREATE MODAL */}
			<AnimatePresence>
				{isEditing && activeProject && (
					<div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.98 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.98 }}
							className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
							<div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
								<h3 className="text-sm font-semibold text-zinc-100">
									{activeProject._index >= 0 ? `Edit Project: ${activeProject.title}` : "Tambah Project Baru"}
								</h3>
								<button
									onClick={() => setIsEditing(false)}
									className="text-zinc-500 hover:text-zinc-300 text-sm">
									✕
								</button>
							</div>

							<form onSubmit={handleSaveForm} className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="block text-[11px] font-medium text-zinc-400 mb-1">Judul Project *</label>
										<input
											type="text"
											required
											value={activeProject.title}
											onChange={(e) => setActiveProject({ ...activeProject, title: e.target.value })}
											className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none transition-all"
										/>
									</div>

									<div>
										<label className="block text-[11px] font-medium text-zinc-400 mb-1">Slug (URL) *</label>
										<input
											type="text"
											required
											value={activeProject.slug}
											onChange={(e) =>
												setActiveProject({
													...activeProject,
													slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
												})
											}
											className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono focus:border-zinc-600 outline-none transition-all"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="block text-[11px] font-medium text-zinc-400 mb-1">Tahun</label>
										<input
											type="text"
											value={activeProject.year}
											onChange={(e) => setActiveProject({ ...activeProject, year: e.target.value })}
											className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none transition-all"
										/>
									</div>

									<div>
										<label className="block text-[11px] font-medium text-zinc-400 mb-1">Status Visibilitas</label>
										<select
											value={activeProject.show ? "true" : "false"}
											onChange={(e) =>
												setActiveProject({ ...activeProject, show: e.target.value === "true" })
											}
											className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none transition-all">
											<option value="true">Tampilkan di Situs</option>
											<option value="false">Sembunyikan (Draft)</option>
										</select>
									</div>
								</div>

								<div>
									<label className="block text-[11px] font-medium text-zinc-400 mb-1">Deskripsi Singkat</label>
									<textarea
										rows={2}
										value={Array.isArray(activeProject.desc) ? activeProject.desc[0] || "" : activeProject.desc}
										onChange={(e) => {
											const descArray = Array.isArray(activeProject.desc) ? [...activeProject.desc] : [activeProject.desc, ""];
											descArray[0] = e.target.value;
											setActiveProject({ ...activeProject, desc: descArray });
										}}
										className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none transition-all"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-medium text-zinc-400 mb-1">Deskripsi Detail</label>
									<textarea
										rows={3}
										value={Array.isArray(activeProject.desc) ? activeProject.desc[1] || "" : ""}
										onChange={(e) => {
											const descArray = Array.isArray(activeProject.desc) ? [...activeProject.desc] : ["", ""];
											descArray[1] = e.target.value;
											setActiveProject({ ...activeProject, desc: descArray });
										}}
										className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none transition-all"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-medium text-zinc-400 mb-1">Tech Stack (pisahkan koma)</label>
									<input
										type="text"
										value={activeProject.tech?.join(", ") || ""}
										onChange={(e) =>
											setActiveProject({
												...activeProject,
												tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
											})
										}
										placeholder="Golang, Vue.js, MQTT, Docker"
										className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-zinc-600 outline-none transition-all"
									/>
								</div>

								{/* Upload Section */}
								<div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-lg space-y-2.5">
									<label className="block text-[11px] font-medium text-zinc-300">Thumbnail Image</label>
									<div className="flex items-center gap-2">
										<input
											type="text"
											value={activeProject.thumbnail || ""}
											onChange={(e) => setActiveProject({ ...activeProject, thumbnail: e.target.value })}
											placeholder="/image/projects/web/name/1.png"
											className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-300 outline-none"
										/>
										<label className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 cursor-pointer transition-all">
											<FontAwesomeIcon icon={isUploading ? faSpinner : faUpload} className={`text-[11px] ${isUploading ? "animate-spin" : ""}`} />
											<span>Upload</span>
											<input
												type="file"
												accept="image/*"
												onChange={(e) => handleFileUpload(e, "thumbnail")}
												className="hidden"
											/>
										</label>
									</div>
									{activeProject.thumbnail && (
										<div className="w-20 h-14 rounded overflow-hidden border border-zinc-800 mt-2">
											<img src={activeProject.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
										</div>
									)}
								</div>

								<div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
									<button
										type="button"
										onClick={() => setIsEditing(false)}
										className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-all">
										Batal
									</button>
									<button
										type="submit"
										className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-lg text-xs transition-all">
										Simpan Project
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</main>
	);
}
