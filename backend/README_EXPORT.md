# SILOGBIS — Koneksi backend → publik (aman, tanpa API publik)

**Kondisi V1.1:** frontend adalah situs statis, dan Master Control tetap sepenuhnya privat. Integrasi dilakukan via **export terverifikasi** lalu commit ke GitHub (Cloudflare mendeteksi commit otomatis). **Bukan live sync.**

## Setup sekali

1. Buka project Apps Script **SILOGBIS yang lama** (yang memiliki `SILO_INTAKE` dan `syncApprovedSubmissionsV2`).
2. Klik `+ → Script`, buat `Public_Export.gs`, copy **SELURUH** `Export_Public_Catalog.gs`. Jangan hapus script lama.
3. Save dan jalankan `setupSilogbisPublicReleaseGateV11` satu kali.
4. Di Master Control akan muncul tab `Public Release Gate` (tambahan untuk authorisasi publikasi saja). **Tidak membuat Master baru.**

## Untuk tiap resource asli

1. Resource atau laporan KP masuk dari Form; reviewer memeriksa lisensi, kerahasiaan dan akses. Di `Submission Review 📥`, pastikan `Permission=Yes`, `Privacy=Cleared`, `Review Status=Approved`, dan `Reviewer` terisi.
2. Jalankan `syncApprovedSubmissionsV2` untuk memindahkan **metadata** ke `Library Catalog 📚`. Ini tidak mempublikasikan resource.
3. Di `Library Catalog 📚`, isi kategori dan **Subcategory / Topic persis sama dengan nama topik dari taxonomy** (lihat daftar di bawah); isi Keywords, Year, URL dan `Last Reviewed`. Ubah `Access` menjadi `Public` dan `Status` menjadi `Published` hanya setelah benar-benar diizinkan.
4. Di `Public Release Gate`, isi Resource ID dan empat kolom `Yes` **hanya setelah cek sungguhan**: copyright, privacy, URL berhasil dibuka di Incognito, dan keputusan rilis. Isi Reviewer dan Review Date.
5. Jalankan `exportSilogbisPublicCatalogV11`. Execution log menunjukkan jumlah resource yang lolos, yang tertahan, dan URL file JSON **di folder Administration privat**.
6. Download JSON tersebut. Di repo GitHub buka `public/data/catalog.json` → Edit file (ikon pensil) → ganti seluruh isi dengan JSON yang diunduh → Commit. Atau upload pengganti melalui `Add file → Upload files` di lokasi `public/data/`.
7. Cloudflare deploy otomatis setelah commit `main` → refresh site → klik resource.

Jangan menyalin spreadsheet mentah ke GitHub. Katalog publik sengaja tidak memuat nama/telepon/email kontributor ataupun alumni.

## Kategori dan topik yang didukung

### Academic Resources
- Course Materials
- Open-Access References
- Study Notes & Learning Guides
- Practice & Exam Preparation
- Academic Templates
### KP & Internship
- Getting Started & Guidelines
- Company & Role Insights
- KP & Internship Reports
- Experience & Lessons Learned
- Applications & Templates
### Research & Final Project
- Research Topics & Ideas
- Final Project Archive
- Research Papers & Publications
- Research Methods & Tools
- Writing & Submission Templates
### Competition & Skill Development
- Business Case & Mini Case
- Business Plan & Entrepreneurship
- Supply Chain & Logistics
- Data Analytics & AI
- Scientific Writing & Innovation
- Tools & Software Academy
- Cross-Competition Toolkit
### Alumni & Industry
- Alumni Stories & Career Paths
- Mentoring & Knowledge Sharing
- Industry Projects & Collaboration
- Opportunities & Events
- Approved Alumni Profiles

## Mengaktifkan Form dengan aman

Selama Form masih unpublished / accepting=false, jangan isi URL-nya ke situs sebagai tombol aktif. Kartu tetap dapat dibuka melalui `Lihat alur kontribusi`.

Setelah Form tertentu dibuka untuk responden dan privacy notice disetujui oleh koordinator, edit `public/data/site-config.json` untuk **Form itu saja**:

```json
{
  "id": "resource",
  "title": "Share a Resource",
  "description": "Bagikan materi yang boleh dibagikan.",
  "enabled": true,
  "qaVerified": true,
  "privacyNoticeApproved": true,
  "url": "https://docs.google.com/forms/d/e/ID_RESMI/viewform"
}
```

Jangan mengubah ID atau field Form lain. Gunakan URL RESPOND resmi, bukan `/edit`. Boleh tetap `mode: pilot` (masih noindex); verifikasi bahwa Form benar-benar menerima respons sebelum mempromosikan tombol.

**Sangat penting:** checklist ini memerlukan keputusan manusia. Export script tidak dapat membuktikan lisensi dan privasi hanya dari nama/status file. Tidak ada sinkronisasi langsung ke backend melalui browser publik.
