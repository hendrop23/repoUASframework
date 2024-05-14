const express = require('express');
const multer = require('multer');
const Model_Users = require('../model/model_users');
const Model_Laporan = require('../model/model_laporan');
const router = express.Router();

// Konfigurasi Multer untuk menyimpan gambar di folder uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ storage: storage });

router.get('/', async function(req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Model_Users.getId(id);
        if (Data.length > 0) {
            if (Data[0].role != "pelapor") {
                res.redirect('/logout');
            } else {
                let id_pelapor = req.session.userId; // Use the logged-in user's ID to fetch laporan data
                let laporan = await Model_Laporan.getByPelaporId(id_pelapor); // Fetch laporan data
                res.render('users/index', {
                    title: 'pelapor Home',
                    nama: Data[0].nama,
                    laporan: laporan // Pass laporan data to the template
                });
            }
        } else {
            res.status(401).json({ error: 'user tidak ada' });
        }
    } catch (error) {
        res.status(501).json('Butuh akses login');
    }
});

// Routes CRUD laporan

// GET laporan by id_pelapor
router.get('/laporan/:id_pelapor', async function(req, res, next) {
    try {
        let id_pelapor = req.params.id_pelapor;
        let laporan = await Model_Laporan.getByPelaporId(id_pelapor);
        res.json(laporan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/create', async function (req, res, next) {
    res.render('users/create', {

    });
});


// POST new laporan
router.post('/laporan', upload.single('gambar'), async function(req, res, next) {
    try {
        // Mendapatkan data dari formulir
        const { judul, detail } = req.body;
        
        // Mendapatkan nama file gambar yang diunggah
        const gambar = req.file.filename;

        // Mendapatkan id_pelapor dari sesi pengguna yang sedang login
        const id_pelapor = req.session.userId;

        // Mendapatkan tanggal dan waktu saat ini
        const date = new Date();
        const tanggal = date.toISOString().split('T')[0];
        const waktu = date.toTimeString().split(' ')[0];

        // Membuat objek data laporan
        const laporanData = {
            judul: judul,
            detail: detail,
            gambar: gambar,
            status: 'on going',
            tanggal: tanggal,
            jam: waktu,
            id_pelapor: id_pelapor
        };

        // Menyimpan data laporan ke dalam database
        let result = await Model_Laporan.Store(laporanData);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/laporan/edit/:id', async function (req, res, next) {
    let id = req.params.id;
    try {
        let laporan = await Model_Laporan.getById(id);
        if (!laporan) {
            return res.status(404).json({ error: 'Laporan tidak ditemukan' });
        }
        res.render('users/edit', {
            id: req.params.id,
            judul: laporan.judul,
            detail: laporan.detail,
            gambar: laporan.gambar,
            status: 'on going',
            tanggal: laporan.tanggal,
            jam: laporan.jam,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route untuk menyimpan perubahan pada laporan
router.post('/laporan/update/:id', upload.single("gambar"), async function (req, res, next) {
    try {
        let id = req.params.id;
        const date = new Date();
    const tanggal = date.toISOString().split('T')[0];
    const waktu = date.toTimeString().split(' ')[0];
        let filebaru = req.file ? req.file.filename : null;
        let laporan = await Model_Laporan.getById(id);
        const namaFileLama = laporan.gambar;
        if (filebaru && namaFileLama) {
            const pathFileLama = path.join(__dirname, '../public/images/upload', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }
        let { judul, detail, jam } = req.body;
        let gambar = filebaru || namaFileLama;
        let laporanData = {
            judul,
            detail,
            gambar,
            status: 'on going',
            tanggal: tanggal,
            jam: waktu,
            
        };
        await Model_Laporan.Update(id, laporanData);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/laporan');   
    } catch {
        req.flash('error', 'Gagal menyimpan data');
        res.redirect('/laporan');
        console.log('gagal simpan');
    }
});

// DELETE laporan
router.get('/laporan/delete/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let result = await Model_Laporan.Delete(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
