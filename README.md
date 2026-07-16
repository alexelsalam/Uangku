# Uangku — Personal Finance Tracker

Aplikasi web untuk mencatat dan menganalisis keuangan pribadi, dengan pendekatan budgeting 50/30/20 dan filtering transaksi yang fleksibel.

**Stack:** React, TypeScript, Tailwind CSS · Express, PostgreSQL · Deployed di Vercel

---

## Masalah yang Diselesaikan

Mencatat pengeluaran itu mudah; melihat pola dari catatan itu yang sulit. Kebanyakan aplikasi pencatat keuangan sederhana hanya menyimpan data tanpa memberi visibilitas yang berguna — sulit menjawab pertanyaan seperti "kategori mana yang naik dibanding bulan lalu?" atau "apakah alokasi budget saya masih sesuai 50/30/20?" tanpa harus mengekspor dan mengolah data manual.

Uangku dibangun untuk menutup gap itu: pencatatan transaksi digabung dengan kategori-grup budget (gaya Kanban) dan laporan perbandingan periode (`/total` endpoint menghitung total periode berjalan + persentase perubahan vs bulan sebelumnya secara otomatis).

## Keputusan Teknis

**PostgreSQL untuk data relasional**
Data finansial di aplikasi ini secara natural berbentuk relasi: satu transaksi terhubung ke satu kategori, satu kategori ke satu grup budget, satu grup ke satu user. Relasi ini butuh integritas referensial (mis. transaksi tidak boleh mengarah ke kategori yang tidak ada) dan query agregasi (SUM per kategori per periode) yang lebih natural ditulis dalam SQL daripada di-*aggregate* di application layer seperti pada NoSQL document store.

**`users_id` diambil dari middleware, bukan request body**
Endpoint transaksi awalnya rentan: kalau `users_id` dikirim lewat body request, user bisa memalsukan ID untuk mengakses/memodifikasi data user lain. Keputusannya: `users_id` diambil dari context autentikasi di middleware, bukan dipercaya dari payload client. Trade-off-nya jelas — sedikit lebih ketat untuk testing manual (butuh token valid), tapi menutup satu jalur manipulasi data yang paling gampang dieksploitasi.

**Backend dipecah jadi 5 layer (types, validators, services, controllers, routes)**
Awalnya endpoint transaksi ditulis dalam satu file. Setelah query filtering-nya makin kompleks, satu file itu sulit ditelusuri saat debugging. Dipecah agar validasi input, logika bisnis, dan routing tidak saling campur — trade-off-nya jumlah file bertambah, tapi tiap perubahan jadi lebih mudah dilacak sumbernya.

## Tantangan

**Query filter dinamis menghasilkan data yang tidak konsisten**
`findTransactions` dirancang untuk mendukung kombinasi filter (kategori, rentang tanggal, dll.) secara fleksibel — dibangun dengan membangun klausa SQL secara dinamis berdasarkan parameter yang aktif. Saat beberapa filter dipakai bersamaan, hasilnya kadang salah atau kurang dari yang seharusnya.

Root cause-nya kombinasi beberapa bug kecil yang saling menutupi:
- Index parameter SQL (`$1`, `$2`, dst.) tidak selalu increment secara konsisten saat filter ditambahkan secara dinamis, sehingga value ke-parameter yang salah bisa terpasang di posisi placeholder yang salah.
- Ada pasangan filter yang saling bergantung (mis. hanya valid kalau filter lain juga aktif) tapi validasinya tidak mengecek kombinasi tersebut, sehingga bisa lolos dalam state yang tidak seharusnya terjadi.
- Input tidak divalidasi untuk kasus `NaN`, jadi filter numerik yang salah format bisa lolos ke query alih-alih ditolak lebih awal.

Perbaikannya: refactor ke pola `push()` helper untuk membangun parameter query — index dan value ditambahkan bersamaan dalam satu langkah, sehingga tidak ada celah untuk index yang tidak sinkron dengan value-nya.

## Status

Proyek aktif dikembangkan. Roadmap berikutnya termasuk pagination pada endpoint transaksi dan explicit column selection pada query untuk mengurangi over-fetching.
