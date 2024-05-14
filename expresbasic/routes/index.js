var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var Model_Users = require('../model/model_users');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
    res.render('auth/register');
});

router.get('/login', function (req, res, next) {
    res.render('auth/login');
});

router.post('/saveusers', async (req, res) => {
    let { nama, password } = req.body;
    let enkripsi = await bcrypt.hash(password, 10);
    let Data = {
        nama,
        password: enkripsi,
        role: ""
    };
    await Model_Users.Store(Data);
    req.flash('success', 'Akun berhasil dibuat');
    res.redirect('/login');
});

router.post('/log', async (req, res) => {
    let { nama, password } = req.body;
    try {
        let Data = await Model_Users.Login(nama);
        if (Data.length > 0) {
            let enkripsi = Data[0].password;
            let cek = await bcrypt.compare(password, enkripsi);
            if (cek) {
                req.session.userId = Data[0].id;

                if (Data[0].role === "") {
                    req.flash('success', 'Berhasil login sebagai ');
                    res.redirect('/superusers');
                } else if (Data[0].role === "") {
                    req.flash('success', 'Berhasil login sebagai ');
                    res.redirect('/users');
                } else {
                    res.redirect('/login');
                }
            } else {
                req.flash('error', 'Nama atau password salah');
                res.redirect('/login');
            }
        } else {
            req.flash('error', 'Akun tidak ditemukan');
            res.redirect('/login');
        }
    } catch (err) {
        res.redirect('/login');
        req.flash('error', 'Terjadi kesalahan saat proses login');
    }
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
