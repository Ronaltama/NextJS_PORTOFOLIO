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
	faCode,
	faLink,
	faImage,
	faShieldAlt,
	faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminPage() {
	const { user, isAdmin, loading, logout } = useAuth();
	const router = useRouter();

	const [projects, setProjects] = useState(initialProjectsData.Projects || []);
	const [activeProject, setActiveProject] = useState(null); // project object being edited
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [statusMessage, setStatusMessage] = useState(null); // { type: 'success'|'error', text: '' }

	// Protection check
	useEffect(() => {
		if (!loading && !isAdmin) {
			router.push("/login");
		}
	}, [loading, isAdmin, router]);

	if (loading || !isAdmin) {
		return (
			<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
				<div className="flex items-center gap-3">
					<FontAwesomeIcon icon={faSpinner} className="animate-spin text-emerald-400 text-2xl" />
					<span className="text-slate-300">Memeriksa Hak Akses Admin...</span>
				</div>
			</div>
		);
	}

	// Handle Save All Projects to Server/GitHub
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
				text: result.message || "Berhasil menyimpan perubahan data project!",
			});
		} catch (err) {
			console.error(err);
			setStatusMessage({
				type: "error",
				text: err.message || "Terjadi kesalahan saat menyimpan data.",
			});
		} finally {
			setIsSaving(false);
		}
	};

	// Handle Toggle Visibility (Show/Hide)
	const handleToggleVisibility = (index) => {
		const updated = [...projects];
		updated[index].show = !updated[index].show;
		setProjects(updated);
		handleSaveAll(updated);
	};

	// Handle Delete Project
	const handleDeleteProject = (index) => {
		if (confirm(`Yakin ingin menghapus project "${projects[index].title}"?`)) {
			const updated = projects.filter((_, i) => i !== index);
			setProjects(updated);
			handleSaveAll(updated);
		}
	};

	// Open Edit Modal / Form
	const handleEditOpen = (proj, index) => {
		setActiveProject({ ...proj, _index: index });
		setIsEditing(true);
	};

	// Open Create New Project Form
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
			_index: -1, // -1 means new project
		});
		setIsEditing(true);
	};

	// Save Project Form Modal
	const handleSaveForm = (e) => {
		e.preventDefault();
		if (!activeProject.title || !activeProject.slug) {
			alert("Judul dan Slug wajib diisi!");
			return;
		}

		const updated = [...projects];
		const projectObj = { ...activeProject };
		delete projectObj._index;

		if (activeProject._index >= 0) {
			updated[activeProject._index] = projectObj;
		} else {
			updated.unshift(projectObj); // Add to start
		}

		setProjects(updated);
		setIsEditing(false);
		handleSaveAll(updated);
	};

	// Image Upload Handler
	const handleFileUpload = async (e, targetField = "thumbnail") => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!activeProject.slug) {
			alert("Mohon isi Slug Project terlebih dahulu sebelum upload gambar!");
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
				if (!res.ok) throw new Error(result.error || "Gagal mengupload gambar.");

				const uploadedUrl = result.url;
				if (targetField === "thumbnail") {
					setActiveProject((prev) => ({ ...prev, thumbnail: uploadedUrl }));
				} else if (targetField === "gallery") {
					setActiveProject((prev) => ({
						...prev,
						images: [...(prev.images || []), uploadedUrl],
					}));
				}

				alert(`Gambar berhasil di-upload: ${uploadedUrl}`);
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
		<main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
			{/* Admin Header Bar */}
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl mb-8 shadow-xl backdrop-blur-md">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg">
						{user?.displayName ? user.displayName[0] : "A"}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
							<span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium flex items-center gap-1">
								<FontAwesomeIcon icon={faShieldAlt} /> Verified Admin
							</span>
						</div>
						<p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={handleCreateOpen}
						className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-sm">
						<FontAwesomeIcon icon={faPlus} /> Tambah Project
					</button>

					<button
						onClick={logout}
						className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-rose-400 px-4 py-2.5 rounded-xl border border-slate-700 transition-all active:scale-95 text-sm">
						<FontAwesomeIcon icon={faSignOutAlt} /> Logout
					</button>
				</div>
			</div>

			{/* Notification Banner */}
			{statusMessage && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className={`max-w-7xl mx-auto mb-6 p-4 rounded-xl flex items-center justify-between text-sm ${
						statusMessage.type === "success"
							? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
							: "bg-rose-500/10 border border-rose-500/30 text-rose-300"
					}`}>
					<div className="flex items-center gap-3">
						<FontAwesomeIcon
							icon={statusMessage.type === "success" ? faCheckCircle : faExclamationCircle}
							className="text-lg"
						/>
						<span>{statusMessage.text}</span>
					</div>
					<button onClick={() => setStatusMessage(null)} className="text-xs underline opacity-80 hover:opacity-100">
						Tutup
					</button>
				</motion.div>
			)}

			{/* Project List Table / Grid */}
			<div className="max-w-7xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
				<div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
					<div>
						<h2 className="text-lg font-bold text-white flex items-center gap-2">
							<FontAwesomeIcon icon={faFolderOpen} className="text-emerald-400" />
							Daftar Project Portofolio ({projects.length})
						</h2>
						<p className="text-slate-400 text-xs mt-1">
							Kelola judul, deskripsi, tech stack, dan gambar yang ditampilkan di situs portofolio.
						</p>
					</div>

					<button
						onClick={() => handleSaveAll()}
						disabled={isSaving}
						className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all shadow-md disabled:opacity-50">
						<FontAwesomeIcon icon={isSaving ? faSpinner : faSave} className={isSaving ? "animate-spin" : ""} />
						<span>{isSaving ? "Menyimpan..." : "Simpan Semua Data"}</span>
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((proj, idx) => (
						<motion.div
							key={proj.slug || idx}
							layout
							className={`bg-slate-950/80 border rounded-xl p-5 flex flex-col justify-between transition-all ${
								proj.show ? "border-slate-800 hover:border-slate-700" : "border-slate-900 opacity-60"
							}`}>
							<div>
								<div className="flex items-start justify-between gap-2 mb-3">
									<h3 className="font-semibold text-white text-base line-clamp-1">{proj.title}</h3>
									<span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
										{proj.year}
									</span>
								</div>

								{/* Thumbnail preview */}
								{proj.thumbnail ? (
									<div className="w-full h-36 bg-slate-900 rounded-lg overflow-hidden mb-3 relative border border-slate-800">
										<img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
									</div>
								) : (
									<div className="w-full h-36 bg-slate-900/50 rounded-lg mb-3 flex items-center justify-center text-slate-600 border border-slate-800/50">
										<FontAwesomeIcon icon={faImage} className="text-2xl" />
									</div>
								)}

								<p className="text-xs text-slate-400 line-clamp-2 mb-3">
									{Array.isArray(proj.desc) ? proj.desc[0] : proj.desc}
								</p>

								{/* Tech Tags */}
								<div className="flex flex-wrap gap-1 mb-4">
									{proj.tech?.slice(0, 4).map((t, i) => (
										<span key={i} className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded">
											{t}
										</span>
									))}
									{proj.tech?.length > 4 && (
										<span className="text-[10px] text-slate-500">+{proj.tech.length - 4}</span>
									)}
								</div>
							</div>

							{/* Action Footer */}
							<div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
								<button
									onClick={() => handleToggleVisibility(idx)}
									className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
										proj.show ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
									}`}>
									<FontAwesomeIcon icon={proj.show ? faEye : faEyeSlash} />
									<span>{proj.show ? "Tampil" : "Sembunyi"}</span>
								</button>

								<div className="flex items-center gap-2">
									<button
										onClick={() => handleEditOpen(proj, idx)}
										className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded transition-colors"
										title="Edit Project">
										<FontAwesomeIcon icon={faEdit} />
									</button>
									<button
										onClick={() => handleDeleteProject(idx)}
										className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded transition-colors"
										title="Hapus Project">
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			{/* EDIT / CREATE PROJECT MODAL */}
			<AnimatePresence>
				{isEditing && activeProject && (
					<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
							<div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
								<h3 className="text-xl font-bold text-white">
									{activeProject._index >= 0 ? `Edit Project: ${activeProject.title}` : "Tambah Project Baru"}
								</h3>
								<button
									onClick={() => setIsEditing(false)}
									className="text-slate-400 hover:text-white text-lg">
									✕
								</button>
							</div>

							<form onSubmit={handleSaveForm} className="space-y-5">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-300 mb-1">Judul Project *</label>
										<input
											type="text"
											required
											value={activeProject.title}
											onChange={(e) => setActiveProject({ ...activeProject, title: e.target.value })}
											className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-slate-300 mb-1">Slug (URL-friendly) *</label>
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
											className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 outline-none"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-medium text-slate-300 mb-1">Tahun</label>
										<input
											type="text"
											value={activeProject.year}
											onChange={(e) => setActiveProject({ ...activeProject, year: e.target.value })}
											className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
										/>
									</div>

									<div>
										<label className="block text-xs font-medium text-slate-300 mb-1">Status Tampil</label>
										<select
											value={activeProject.show ? "true" : "false"}
											onChange={(e) =>
												setActiveProject({ ...activeProject, show: e.target.value === "true" })
											}
											className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none">
											<option value="true">Tampilkan di Web</option>
											<option value="false">Sembunyikan</option>
										</select>
									</div>
								</div>

								{/* Descriptions */}
								<div>
									<label className="block text-xs font-medium text-slate-300 mb-1">Deskripsi Singkat</label>
									<textarea
										rows={2}
										value={Array.isArray(activeProject.desc) ? activeProject.desc[0] || "" : activeProject.desc}
										onChange={(e) => {
											const descArray = Array.isArray(activeProject.desc) ? [...activeProject.desc] : [activeProject.desc, ""];
											descArray[0] = e.target.value;
											setActiveProject({ ...activeProject, desc: descArray });
										}}
										className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
									/>
								</div>

								<div>
									<label className="block text-xs font-medium text-slate-300 mb-1">Deskripsi Detail</label>
									<textarea
										rows={3}
										value={Array.isArray(activeProject.desc) ? activeProject.desc[1] || "" : ""}
										onChange={(e) => {
											const descArray = Array.isArray(activeProject.desc) ? [...activeProject.desc] : ["", ""];
											descArray[1] = e.target.value;
											setActiveProject({ ...activeProject, desc: descArray });
										}}
										className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
									/>
								</div>

								{/* Tech Stack */}
								<div>
									<label className="block text-xs font-medium text-slate-300 mb-1">Tech Stack (pisahkan koma)</label>
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
										className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
									/>
								</div>

								{/* Image Thumbnail Upload Section */}
								<div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
									<label className="block text-xs font-semibold text-emerald-400">Thumbnail Project</label>
									<div className="flex items-center gap-3">
										<input
											type="text"
											value={activeProject.thumbnail || ""}
											onChange={(e) => setActiveProject({ ...activeProject, thumbnail: e.target.value })}
											placeholder="/image/projects/web/name/1.png"
											className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
										/>
										<label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-700 cursor-pointer transition-all">
											<FontAwesomeIcon icon={isUploading ? faSpinner : faUpload} className={isUploading ? "animate-spin" : ""} />
											<span>Upload Foto</span>
											<input
												type="file"
												accept="image/*"
												onChange={(e) => handleFileUpload(e, "thumbnail")}
												className="hidden"
											/>
										</label>
									</div>
									{activeProject.thumbnail && (
										<div className="w-24 h-16 rounded overflow-hidden border border-slate-800 mt-2">
											<img src={activeProject.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
										</div>
									)}
								</div>

								{/* Action Buttons */}
								<div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
									<button
										type="button"
										onClick={() => setIsEditing(false)}
										className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all">
										Batal
									</button>
									<button
										type="submit"
										className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20">
										Simpan Project Ini
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
