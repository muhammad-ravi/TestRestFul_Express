var controller = require('../controller/testingParkirMobil');
var express = require('express');
var router = express.Router();

router.post('/InsertDataParkir', controller.registrasiMobil);
router.get('/OutDataParkirMobil', controller.outDataParkirMobil);
router.get('/getAllDataParkir', controller.getAllDataParkir);
router.get('/getJumlahParkirByTipe', controller.getJumlahParkirByTipe);
router.get('/getPlatNomorByWarna', controller.getPlatNomorByWarna);
router.get('/getAllReportParkirMobil', controller.getAllReportParkirMobil);

module.exports = router;
