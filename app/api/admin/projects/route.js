import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Helper function to commit or update file via GitHub API
async function updateGitHubFile({ filePath, content, message, isBinary = false }) {
	const owner = process.env.GITHUB_REPO_OWNER || "ronaltama";
	const repo = process.env.GITHUB_REPO_NAME || "NextJS_PORTOFOLIO";
	const branch = process.env.GITHUB_REPO_BRANCH || "main";
	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		throw new Error("GITHUB_TOKEN tidak ditemukan di Environment Variables.");
	}

	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
	const headers = {
		Authorization: `Bearer ${token}`,
		Accept: "application/vnd.github+json",
		"User-Agent": "NextJS-Portfolio-Admin",
	};

	// 1. Get current file SHA if file exists
	let sha = undefined;
	try {
		const getRes = await fetch(url, { headers });
		if (getRes.ok) {
			const fileData = await getRes.json();
			sha = fileData.sha;
		}
	} catch (e) {
		console.warn("File mungkin belum ada di GitHub, membuat file baru...", e);
	}

	// 2. Prepare Base64 content
	let base64Content = "";
	if (isBinary) {
		base64Content = content; // already base64 string
	} else {
		base64Content = Buffer.from(content, "utf-8").toString("base64");
	}

	// 3. Put updated file
	const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
		method: "PUT",
		headers,
		body: JSON.stringify({
			message,
			content: base64Content,
			sha,
			branch,
		}),
	});

	if (!putRes.ok) {
		const errText = await putRes.text();
		throw new Error(`GitHub API Error (${putRes.status}): ${errText}`);
	}

	return await putRes.json();
}

export async function POST(request) {
	try {
		const body = await request.json();
		const { action, data, image } = body;

		// 1. Action: UPDATE_PROJECTS (Simpan data.json)
		if (action === "UPDATE_PROJECTS") {
			const jsonString = JSON.stringify(data, null, 2);
			const relativePath = "json/data.json";

			if (process.env.GITHUB_TOKEN) {
				await updateGitHubFile({
					filePath: relativePath,
					content: jsonString,
					message: "feat(admin): update project data via Admin Dashboard",
				});
				return NextResponse.json({
					success: true,
					message: "Data project berhasil disimpan dan di-commit ke GitHub!",
					source: "github",
				});
			} else {
				const localPath = path.join(process.cwd(), relativePath);
				await fs.writeFile(localPath, jsonString, "utf-8");
				return NextResponse.json({
					success: true,
					message: "Data project berhasil disimpan ke lokal (Dev Mode)!",
					source: "local",
				});
			}
		}

		// 1.1 Action: UPDATE_EXPERIENCES (Simpan experiences.json)
		if (action === "UPDATE_EXPERIENCES") {
			const jsonString = JSON.stringify(data, null, 2);
			const relativePath = "json/experiences.json";

			if (process.env.GITHUB_TOKEN) {
				await updateGitHubFile({
					filePath: relativePath,
					content: jsonString,
					message: "feat(admin): update experiences data via Admin Dashboard",
				});
				return NextResponse.json({
					success: true,
					message: "Data pengalaman berhasil disimpan dan di-commit ke GitHub!",
					source: "github",
				});
			} else {
				const localPath = path.join(process.cwd(), relativePath);
				await fs.writeFile(localPath, jsonString, "utf-8");
				return NextResponse.json({
					success: true,
					message: "Data pengalaman berhasil disimpan ke lokal (Dev Mode)!",
					source: "local",
				});
			}
		}

		// 1.2 Action: UPDATE_EDUCATION (Simpan education.json)
		if (action === "UPDATE_EDUCATION") {
			const jsonString = JSON.stringify(data, null, 2);
			const relativePath = "json/education.json";

			if (process.env.GITHUB_TOKEN) {
				await updateGitHubFile({
					filePath: relativePath,
					content: jsonString,
					message: "feat(admin): update education & achievements data via Admin Dashboard",
				});
				return NextResponse.json({
					success: true,
					message: "Data pendidikan & prestasi berhasil disimpan dan di-commit ke GitHub!",
					source: "github",
				});
			} else {
				const localPath = path.join(process.cwd(), relativePath);
				await fs.writeFile(localPath, jsonString, "utf-8");
				return NextResponse.json({
					success: true,
					message: "Data pendidikan & prestasi berhasil disimpan ke lokal (Dev Mode)!",
					source: "local",
				});
			}
		}

		// 1.3 Action: UPDATE_SKILLS (Simpan skills.json)
		if (action === "UPDATE_SKILLS") {
			const jsonString = JSON.stringify(data, null, 2);
			const relativePath = "json/skills.json";

			if (process.env.GITHUB_TOKEN) {
				await updateGitHubFile({
					filePath: relativePath,
					content: jsonString,
					message: "feat(admin): update skills data via Admin Dashboard",
				});
				return NextResponse.json({
					success: true,
					message: "Data skills berhasil disimpan dan di-commit ke GitHub!",
					source: "github",
				});
			} else {
				const localPath = path.join(process.cwd(), relativePath);
				await fs.writeFile(localPath, jsonString, "utf-8");
				return NextResponse.json({
					success: true,
					message: "Data skills berhasil disimpan ke lokal (Dev Mode)!",
					source: "local",
				});
			}
		}

		// 1.4 Action: UPDATE_PROFILE (Simpan profile.json)
		if (action === "UPDATE_PROFILE") {
			const jsonString = JSON.stringify(data, null, 2);
			const relativePath = "json/profile.json";

			if (process.env.GITHUB_TOKEN) {
				await updateGitHubFile({
					filePath: relativePath,
					content: jsonString,
					message: "feat(admin): update profile & bio data via Admin Dashboard",
				});
				return NextResponse.json({
					success: true,
					message: "Data profil & bio berhasil disimpan dan di-commit ke GitHub!",
					source: "github",
				});
			} else {
				const localPath = path.join(process.cwd(), relativePath);
				await fs.writeFile(localPath, jsonString, "utf-8");
				return NextResponse.json({
					success: true,
					message: "Data profil & bio berhasil disimpan ke lokal (Dev Mode)!",
					source: "local",
				});
			}
		}

		// 2. Action: UPLOAD_IMAGE (Upload foto project)
		if (action === "UPLOAD_IMAGE") {
			const { fileName, base64Data, slug } = image;
			if (!fileName || !base64Data || !slug) {
				return NextResponse.json(
					{ error: "Data gambar tidak lengkap (fileName, base64Data, slug diperlukan)." },
					{ status: 400 }
				);
			}

			// Clean base64 string
			const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
			const relativePath = `public/image/projects/${slug}/${fileName}`;
			const publicUrlPath = `/image/projects/${slug}/${fileName}`;

			if (process.env.GITHUB_TOKEN) {
				await updateGitHubFile({
					filePath: relativePath,
					content: cleanBase64,
					message: `feat(admin): upload image ${fileName} for ${slug}`,
					isBinary: true,
				});
				return NextResponse.json({
					success: true,
					url: publicUrlPath,
					message: "Foto berhasil diupload dan di-commit ke GitHub!",
					source: "github",
				});
			} else {
				// Local Dev Mode
				const dirPath = path.join(process.cwd(), "public", "image", "projects", slug);
				await fs.mkdir(dirPath, { recursive: true });
				const filePath = path.join(dirPath, fileName);
				const buffer = Buffer.from(cleanBase64, "base64");
				await fs.writeFile(filePath, buffer);

				return NextResponse.json({
					success: true,
					url: publicUrlPath,
					message: "Foto berhasil di-upload ke lokal (Dev Mode)!",
					source: "local",
				});
			}
		}

		return NextResponse.json({ error: "Action tidak dikenal." }, { status: 400 });
	} catch (error) {
		console.error("Admin API Route Error:", error);
		return NextResponse.json({ error: error.message || "Terjadi kesalahan pada server." }, { status: 500 });
	}
}
