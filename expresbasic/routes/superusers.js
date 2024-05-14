var express = require('express');
const Model_Users = require('../model/model_users');
const Model_Laporan = require('../model/model_laporan');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Model_Users.getId(id);
        if (Data.length > 0) {
            if (Data[0].role != "petugas") {
                res.redirect('/logout');
            } else {
                // Fetch semua laporan
                let laporan = await Model_Laporan.getAll();
    
                res.render('users/super', {
                    title: 'petugas Home',
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

// GET all laporan
router.get('/laporan', async function(req, res, next) {
    try {
        let laporan = await Model_Laporan.getAll();
        res.json(laporan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// PUT update laporan status
router.get('/laporan/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let result = await Model_Laporan.Updatestatus(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
