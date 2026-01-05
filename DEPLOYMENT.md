# 🚀 Deployment Guide: Vercel + Custom Domain

Panduan lengkap untuk deploy portfolio ke **Vercel** dan menghubungkan dengan **custom domain**.

---

## 📋 Prerequisites

- [x] Repository sudah di-push ke GitHub
- [x] Akun [Vercel](https://vercel.com) (gratis)
- [x] Custom domain (opsional)

---

## 1️⃣ GitHub Repository Setup

### Rekomendasi Settings

1. **Buka repository di GitHub** → Settings

2. **General Settings**:
   - ✅ Pastikan repository bersifat Public (atau Private jika pakai Vercel Pro)
   
3. **Branches** (opsional):
   - Tambahkan branch protection untuk `main`:
     - Require pull request before merging
     - Require status checks to pass

### Files yang Diperlukan

Pastikan file-file ini ada di repository:
- `package.json` - Dependencies dan scripts
- `next.config.js` - Next.js configuration
- `.env.example` - Template environment variables

> ⚠️ **Jangan commit file `.env.local`** - file ini sudah ada di `.gitignore`

---

## 2️⃣ Connect ke Vercel

### Step 1: Import Project

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **"Import Git Repository"**
3. Pilih **GitHub** dan authorize jika diminta
4. Cari dan pilih repository `Alvalens-porto-2-nextJs`

### Step 2: Configure Project

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `./ ` (default) |
| **Build Command** | `pnpm build` atau `next build` |
| **Output Directory** | `.next` (default) |
| **Install Command** | `pnpm install` |

### Step 3: Environment Variables

Tambahkan environment variables (opsional, untuk Spotify):

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | `your_client_id` | Production, Preview, Development |
| `NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET` | `your_client_secret` | Production, Preview, Development |
| `NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN` | `your_refresh_token` | Production, Preview, Development |

### Step 4: Deploy

1. Klik **"Deploy"**
2. Tunggu proses build selesai (biasanya 1-2 menit)
3. 🎉 Website sudah live di `https://your-project.vercel.app`

---

## 3️⃣ Custom Domain Setup

### Di Vercel Dashboard

1. Buka **Project** → **Settings** → **Domains**
2. Klik **"Add"**
3. Masukkan domain (contoh: `ronaltama.my.id`)
4. Klik **"Add"**

Vercel akan memberikan instruksi DNS. Biasanya ada 2 opsi:

#### Opsi A: Apex Domain (ronaltama.my.id)

Tambahkan **A Record**:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |

#### Opsi B: Subdomain (www.ronaltama.my.id)

Tambahkan **CNAME Record**:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | `cname.vercel-dns.com` |

### Rekomendasi: Redirect www ke non-www

Di Vercel:
1. Tambahkan kedua domain (`ronaltama.my.id` dan `www.ronaltama.my.id`)
2. Set `ronaltama.my.id` sebagai **Primary**
3. `www.ronaltama.my.id` akan otomatis redirect ke primary

---

## 4️⃣ DNS Configuration

### Akses DNS Provider

Masuk ke panel DNS di domain provider kamu (contoh: Niagahoster, Cloudflare, Namecheap, dll.)

### Contoh Konfigurasi DNS

```
# A Record untuk apex domain
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

# CNAME untuk www subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Waktu Propagasi

- DNS propagation membutuhkan waktu **1 menit - 48 jam**
- Cek status propagasi di [dnschecker.org](https://dnschecker.org)

---

## 5️⃣ SSL Certificate

✅ **Otomatis dari Vercel!**

Setelah DNS ter-propagasi:
- Vercel otomatis issue SSL certificate (Let's Encrypt)
- Website akan bisa diakses via HTTPS
- Certificate akan di-renew otomatis

---

## 6️⃣ Verification

### Checklist Deployment

- [ ] Website bisa diakses di `https://your-project.vercel.app`
- [ ] Custom domain bisa diakses (jika dikonfigurasi)
- [ ] SSL/HTTPS aktif (gembok hijau di browser)
- [ ] Semua halaman berfungsi (Home, About, Projects)
- [ ] Images loading dengan benar
- [ ] Analytics aktif (cek Vercel Dashboard → Analytics)

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Build failed | Cek build logs di Vercel. Biasanya error di dependencies atau TypeScript |
| Domain not working | Pastikan DNS sudah benar. Tunggu propagasi hingga 48 jam |
| Images not loading | Cek path di `next.config.js` dan pastikan images ada di `/public` |
| 404 on refresh | Pastikan menggunakan Next.js routing yang benar |

---

## 7️⃣ Auto-Deploy

### GitHub Integration

Setiap kali kamu push ke branch `main`:
1. Vercel otomatis detect changes
2. Trigger build baru
3. Deploy ke production

### Preview Deployments

Setiap pull request akan membuat **Preview URL** terpisah untuk testing sebelum merge.

---

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Custom Domain Guide](https://vercel.com/docs/concepts/projects/domains)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 💡 Tips

1. **Gunakan branch protection** untuk mencegah push langsung ke `main`
2. **Setup Preview Deployments** untuk testing di PR
3. **Monitor Analytics** di Vercel Dashboard
4. **Set up Alerts** untuk notifikasi jika build gagal

---

<div align="center">

**Need help?** Open an issue di [GitHub Repository](https://github.com/ronaltama/Alvalens-porto-2-nextJs/issues)

</div>
