# SILOGBIS Knowledge Hub — Navigator V1

**Status: private-content-safe pilot, not public launch.**

Website statis SILOGBIS dengan logo resmi, lima hub akademik, 27 topik, pencarian/filer, navigasi berbasis kebutuhan, dan jalur kontribusi yang diatur manual. Hosting: **Cloudflare Workers Static Assets**. Source control: **GitHub milik SILOGBIS**. Tidak ada database, login, API key, atau server script pada frontend.

## Yang sudah berfungsi

- Landing page navy–blue berbasis logo asli SILOGBIS (citra hanya dipotong dari transparansi, tidak digambar ulang).
- Pencarian topik, hub dan resource yang telah diterbitkan.
- Filter lima hub dan browsing 27 subkategori.
- Guided navigation berdasarkan tujuan (mata kuliah / KP / kompetisi / riset).
- Tampilan mobile & desktop, navigasi keyboard, reduced motion, focus states.
- Tiga kartu kontribusi yang **disabled** selama pilot.
- Katalog hanya menampilkan record bila `Published` + `Public` + `rightsVerified: true` + `privacyCleared: true`.
- `noindex` dan minimal security headers untuk tahap pilot; script validasi sebelum deploy.

## Struktur file

```
public/
  index.html                     Homepage publik
  404.html                       Halaman 404
  assets/
    app.js                       Search, filter, interaksi
    styles.css                   Tampilan
    silogbis-logo.png            Logo asli SILOGBIS (trim transparansi)
    silogbis-mark.png            Potongan simbol logo asli
  data/
    taxonomy.json                5 hub dan 27 topik
    catalog.json                 HANYA resource approved untuk publik
    site-config.json             Mode pilot/public dan 3 Form
  _headers                       Security headers Cloudflare
  robots.txt                     Crawler boleh melihat tag noindex
  favicon.png
scripts/validate.mjs             Pengecekan sebelum deploy
wrangler.jsonc                   Workers Static Assets configuration
package.json                     Wrangler + quality gate
README.md / START_HERE.txt

docs/
  CONTENT_PLAYBOOK.md            SOP kurasi & publishing
  QA_CHECKLIST.md                Uji sebelum peluncuran
```

## Cara pertama kali upload ke GitHub (pemula)

1. Login / buat **GitHub** dengan identitas yang dapat diteruskan oleh SILOGBIS, bukan password bersama. Aktifkan 2FA. Sebaiknya buat **GitHub Organization** dan undang minimal dua maintainer dengan akun masing-masing.
2. Buat **repository PRIVATE**: `silogbis-knowledge-hub`.
3. Unduh ZIP paket ini dan **Extract All**.
4. Di GitHub, buka repo → **Add file → Upload files**. Tarik **isi folder** `silogbis-knowledge-hub` (bukan folder induknya sebagai satu lapis ekstra). Pastikan `wrangler.jsonc`, `package.json`, dan folder `public/` terlihat di root repo. Commit.
5. Jangan pernah unggah file spreadsheet Master Control, export response, token, atau registry alumni ke repo.

## Deploy Cloudflare Workers Static Assets (manual)

1. Masuk ke https://dash.cloudflare.com/ dengan akun organisasi. Pilih paket Free. Tidak perlu billing upgrade.
2. Buka **Workers & Pages → Create application → Connect to GitHub** (teks bisa berubah). Beri izin hanya repository SILOGBIS yang diperlukan.
3. Pilih repo `silogbis-knowledge-hub`; nama Worker **wajib cocok** dengan `name` di `wrangler.jsonc`: `silogbis-knowledge-hub`.
4. Root directory repo: `/` atau kosong/default.
5. Build command: `npm run build`.
6. Deploy command: `npx wrangler deploy` (default biasanya sama).
7. Simpan dan Deploy. Cloudflare menyediakan subdomain seperti `silogbis-knowledge-hub.<subdomain-akun>.workers.dev` (URL sebenarnya baru diketahui setelah deployment).
8. Lihat hasil website di desktop dan ponsel. **Jangan mengumumkan URL** sebelum konten dan izin beres.

Cloudflare dokumentasi: https://developers.cloudflare.com/workers/ci-cd/builds/ dan https://developers.cloudflare.com/workers/static-assets/get-started/

Jika Cloudflare menolak nama Worker, cocokkan ulang `wrangler.jsonc` dengan nama yang tersedia **sebelum** men-deploy. Bila setup dashboard tidak menampilkan opsi yang persis sama, periksa dokumentasi resmi yang paling baru.

## Cara edit tampilannya (tanpa menyentuh backend)

- Warna, spacing, responsive → `public/assets/styles.css`.
- Judul dan kalimat di halaman → `public/index.html`.
- Kategori dan kata kunci → `public/data/taxonomy.json`.
- Kontribusi Form → `public/data/site-config.json`.
- Resource publik → `public/data/catalog.json`.

Setiap commit ke branch yang dihubungkan ke Cloudflare dapat memicu deployment. Gunakan pull request dan review admin kedua untuk perubahan konten publik.

## Cara memperbarui katalog

**Jangan pernah menyalin seluruh Master Control.** Ambil hanya resource yang benar-benar:
1. Lolos pengecekan hak berbagi dan kerahasiaan.
2. Memiliki status `Published`.
3. Level akses `Public`.
4. Link HTTPS benar-benar bisa dibuka melalui Incognito tanpa meminta akses yang tidak semestinya.

Contoh format record yang valid (ini hanyalah format **contoh**, bukan resource nyata):

```json
{
  "id": "RES-PUB-0001",
  "title": "Contoh Judul Sumber Terverifikasi",
  "summary": "Ringkasan satu atau dua kalimat tanpa data privat.",
  "type": "Guide",
  "year": "2026",
  "hubId": "competition",
  "topicId": "business-case",
  "url": "https://example.org/approved-resource",
  "status": "Published",
  "accessLevel": "Public",
  "rightsVerified": true,
  "privacyCleared": true
}
```

Simpan record dalam array JSON di `public/data/catalog.json`. Validasi akan menolak record tanpa gate keamanan. Jangan masukkan contoh di atas sebagai resource nyata.

## Google Forms

Default: ketiganya **tidak aktif**. Baru hidupkan satu Form jika:
- Form resmi sudah dibuka oleh Admin SILOGBIS dan diuji ulang.
- Pemberitahuan privasi, consent, dan trigger Form sudah dicek.
- `site-config.json` diubah: `mode: "public"`, `enabled: true`, dan `url` hanya `https://docs.google.com/forms/.../viewform` (bukan link edit).

Mode pilot sengaja menolak menyimpan URL Form sama sekali dalam JSON publik. `noindex` juga aktif hingga release.

## GO LIVE (jangan dilakukan sebelum QA)

1. Pastikan minimal **3** resource nyata telah diverifikasi dan ada di `catalog.json` (pemeriksaan build mensyaratkan ini untuk public mode).
2. Uji akses link, logo, mobile, keyboard, search, dan izin folder.
3. Dalam `public/data/site-config.json` ganti `mode` menjadi `public`. Jangan mengaktifkan Form yang belum direview.
4. Dalam `<head>` `public/index.html` HAPUS tag `<meta name="robots" content="noindex,nofollow">`. Script `npm run build` sengaja akan gagal bila mode publik masih `noindex`.
5. Setelah URL hosting final diketahui, tambahkan URL canonical, `sitemap.xml` yang benar, dan update OG image absolute URL; daftarkan situs di Google Search Console.
6. Re-review PR oleh admin kedua, merge, dan lihat website dari browser Incognito.

**PENTING:** `noindex` BUKAN proteksi kata sandi. Website `workers.dev` dapat dilihat orang yang mengetahui URL. Pilot aman karena tidak mengandung data privat, bukan karena sembunyi dari Google.

## Backup dan handover

- Simpan repo PRIVATE dan export ZIP sumber kode sebagai backup institusional.
- GitHub dan Cloudflare dikelola memakai akun masing-masing pengurus, bukan shared password; aktifkan 2FA.
- Minimal dua maintainer dan dokumentasi akun pemilik. Audit akses tiap pergantian periode.
- Master Control, data alumni, raw Form responses, SOP admin dan Drive folder internal **tidak pernah dipublikasikan di website**.
- Untuk rollback gunakan GitHub revert / Cloudflare Deployments versi sebelumnya.

**Backend Google Workspace yang sudah ada tidak perlu diubah atau dijalankan ulang.**
