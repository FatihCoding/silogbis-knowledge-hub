# SILOGBIS — Workflow Konten Publik

## Prinsip
Master Control adalah sumber keputusan internal; website statis hanya menampilkan **export yang sudah disaring**. Tidak ada sambungan browser langsung ke Master Control.

## Langkah editorial

1. **Submission** — resource/KP masuk Form dan antrean review privat.
2. **Permission check** — verifikasi hak berbagi/lisensi, pemilik dokumen, izin organisasi/perusahaan; deklarasi kontributor saja tidak cukup.
3. **Privacy check** — hapus nomor, alamat, NIM, informasi perusahaan rahasia, identitas alumni yang belum memberi consent; bila tidak bisa disanitasi, jangan publikasi.
4. **Content check** — relevansi, ketepatan judul, kegunaan, tidak duplikat, kondisi sumber.
5. **Link access check** — buka Incognito sebagai pengunjung bukan pengurus; harus benar-benar dapat diakses secara legal.
6. **Approval** — reviewer menandai `Approved` dan record siap dibagikan. Ini belum berarti Published.
7. **Publication** — setelah recheck, reviewer menandai Published dan Public, beri ID resource. Hanya metadata yang diperlukan masuk `catalog.json`.
8. **Quality gate** — pull request, jalankan build, cek diff, minimal satu admin lain approve, baru merge.
9. **Maintenance** — audit broken links setiap bulan / setiap semester; beri tanggal review di Master, bukan halaman publik jika belum diverifikasi.

## Peran untuk organisasi
- **Librarian/Editor** mengkurasi teks dan izin.
- **Reviewer/Privacy PIC** memutuskan boleh/tidaknya publikasi.
- **Website maintainer** meng-update `catalog.json`, bukan mengubah status approval.
- **Owner/SILOGBIS official** mengelola GitHub dan Cloudflare dengan 2FA dan SOP handover.

## Arti metadata
- `hubId`: salah satu `academic`, `internship`, `research`, `competition`, `alumni`.
- `topicId`: subkategori tepat sebagaimana terdaftar di `taxonomy.json`.
- `status`: literal `Published`, bukan `Approved`.
- `accessLevel`: literal `Public`, bukan `Internal` atau `Restricted`.
- `rightsVerified` dan `privacyCleared`: boolean `true` bila admin sudah memverifikasi dan mendokumentasikan bukti secara internal.
- `url`: HTTPS yang benar-benar dapat diakses pengunjung. Jangan pakai link folder privat.

## Yang tidak pernah masuk katalog publik
- Raw spreadsheet form responses atau Google Sheets Master Control.
- Kontak email/nomor telepon alumni, meskipun profilnya diizinkan tampil.
- Dokumen perusahaan yang confidential, buku komersial bajakan, soal ujian terlarang, atau berkas tanpa izin.
- Catatan reviewer, alasan penolakan, akun admin, token API, email responden.

## Perubahan taksonomi
Pengubahan kategori harus disesuaikan dengan Master Control dan didokumentasikan; jangan menghapus ID topik yang sudah dipakai record terbit tanpa migrasi data.
