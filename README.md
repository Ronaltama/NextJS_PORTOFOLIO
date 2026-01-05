# Ronaltama Portfolio

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.2.8-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)

**Portfolio website milik Edwin Ronaltama Mabrur**  
Software Engineer & Full Stack Developer dengan spesialisasi Smart Systems dan IoT

[Live Demo](https://ronaltama.vercel.app) • [Documentation](DEPLOYMENT.md)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Scroll-Snap Navigation** | Smooth full-page scrolling dengan CSS scroll-snap |
| 🎨 **Framer Motion Animations** | Animasi modern dan interaktif di seluruh halaman |
| 📱 **Fully Responsive** | Optimal di semua ukuran layar |
| 📊 **Dynamic Project Data** | Data project dibaca dari JSON file |
| 📈 **Vercel Analytics** | Tracking performa dan visitor |
| ⚡ **Turbopack** | Development server yang super cepat |

---

## 🛠️ Tech Stack

### Core
- **[Next.js 15](https://nextjs.org/)** - React Framework dengan App Router
- **[React 19](https://react.dev/)** - UI Library
- **[Turbopack](https://turbo.build/pack)** - Blazing fast bundler

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Font Awesome](https://fontawesome.com/)** - Icon library

### Utilities
- **[Sharp](https://sharp.pixelplumbing.com/)** - Image optimization
- **[SWR](https://swr.vercel.app/)** - Data fetching
- **[NProgress](https://ricostacruz.com/nprogress/)** - Progress bar

---

## 📁 Project Structure

```
├── app/
│   ├── (root)/              # Home page dengan scroll-snap sections
│   │   └── page.jsx         # Home, About preview, Projects preview, Contact
│   ├── about/               # About page
│   │   ├── components/      # Skills, Education, Experience
│   │   └── page.jsx
│   ├── projects/            # Projects page
│   │   ├── [slug]/          # Dynamic project detail
│   │   ├── archive/         # Archived projects
│   │   └── page.jsx
│   ├── layout.jsx           # Root layout dengan Navbar
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── Navbar.jsx           # Navigation dengan hamburger menu
│   ├── Footer.jsx           # Footer component
│   ├── Button.jsx           # Button variants
│   └── Hr.jsx               # Horizontal rule with animation
├── json/
│   └── data.json            # Project data
├── public/
│   ├── image/               # Project images
│   └── docs/                # CV/Resume PDF
└── next.config.js           # Next.js configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 atau lebih tinggi
- **pnpm** (recommended) atau npm/yarn

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/ronaltama/Alvalens-porto-2-nextJs.git
   cd Alvalens-porto-2-nextJs
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local`** (optional - untuk Spotify widget)
   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
   NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```
   > Untuk setup Spotify API, lihat [panduan ini](https://leerob.io/blog/spotify-api-nextjs)

5. **Run development server**
   ```bash
   pnpm dev
   ```

6. **Open browser**  
   Buka [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server dengan Turbopack |
| `pnpm build` | Build untuk production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm generate-sitemap` | Generate sitemap.xml |

---

## 🌐 Deployment

Lihat **[DEPLOYMENT.md](DEPLOYMENT.md)** untuk panduan lengkap:
- Deploy ke Vercel
- Setup custom domain
- Konfigurasi DNS
- Environment variables

---

## 🎨 Customization

### Mengubah Data Project

Edit file `json/data.json`:

```json
{
  "Projects": [
    {
      "show": true,
      "title": "Nama Project",
      "desc": ["Deskripsi singkat", "Deskripsi detail"],
      "year": "2025",
      "thumbnail": "/image/projects/web/nama/1.png",
      "images": ["/image/projects/web/nama/1.png"],
      "tech": ["React", "Node.js"],
      "slug": "nama-project",
      "category": [1]
    }
  ]
}
```

### Mengubah Informasi Personal

Edit file `app/layout.jsx` untuk metadata dan `app/(root)/page.jsx` untuk konten home.

---

## 📄 License

This project is licensed under the **GPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Edwin Ronaltama Mabrur**

- Website: [ronaltama.vercel.app](https://ronaltama.vercel.app)
- GitHub: [@ronaltama](https://github.com/ronaltama)
- LinkedIn: [ronaltama](https://linkedin.com/in/ronaltama)
- Email: tama.ronal@gmail.com

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Copyright © 2025 Edwin Ronaltama Mabrur

</div>