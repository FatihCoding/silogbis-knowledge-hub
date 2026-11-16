# SILOGBIS Website — Go/No-Go Checklist

## Security
- [ ] Public website tidak memuat ID Master Control, Private Alumni Registry atau Internal Operations.
- [ ] Tidak ada password, API key atau data pribadi dalam folder `public/` maupun repository.
- [ ] Resource link benar-benar terbuka di browser incognito tanpa login anggota organisasi.
- [ ] Resource tercatat Published + Public + rightsVerified + privacyCleared.
- [ ] Alumni Directory memuat hanya profil dengan explicit consent (di versi awal, belum ada profil yang tampil).
- [ ] Google Form alumni mempunyai pemberitahuan privasi, tujuan, retensi, dan pilihan menarik consent.
- [ ] Mode pilot masih noindex; jangan anggap noindex sebagai kontrol akses.

## Navigation & UX
- [ ] Logo SILOGBIS tampil utuh di desktop dan mobile.
- [ ] Lima knowledge hubs tampil sesuai kategori internal.
- [ ] Search 'business case' menampilkan Competition & Skill Development.
- [ ] Search 'KP' menampilkan KP & Internship.
- [ ] Pilih 'Explore internships' kemudian 'Explore related topics' menuju hub KP.
- [ ] Browse Topics membuka subtopik, tombol topik menuju koleksi filter yang tepat.
- [ ] Katalog kosong memberikan pesan jujur; tidak ada angka resource palsu.
- [ ] Menu mobile bisa dibuka dan ditutup; tidak ada scroll horizontal.
- [ ] Navigasi keyboard (Tab, Enter, / pada search, Escape) berjalan.
- [ ] Link keluar pakai HTTPS dan membuka tab baru dengan rel=noopener.

## Operations
- [ ] `npm run build` / Cloudflare build tidak menghasilkan error.
- [ ] Repository dimiliki organisasi dengan dua maintainer dan 2FA.
- [ ] Cloudflare menampilkan deployment URL benar dan tidak meminta upgrade berbayar.
- [ ] Form yang statusnya tertutup tidak mempunyai CTA aktif.
- [ ] Handover SOP dan prosedur review ada di dokumentasi.
- [ ] Setelah launch: metadata SEO, canonical dan sitemap sesuai domain final.
- [ ] Setelah launch: verifikasi situs di Search Console dan permintaan indexing (tanpa janji pasti muncul).

## Smoke QA yang dilakukan sebelum pengiriman
- Struktur 5 hub + 27 topik; katalog 0 verified pada pilot.
- Search business case, pilih topik, filter berdasarkan tujuan, menu mobile, responsive overflow.
- Catalog privacy gate: mock Published/Public dan mock Restricted diuji secara terpisah; hanya Public yang tampil.
- Smoke check tidak menulis atau membaca Master Google Sheets asli.
