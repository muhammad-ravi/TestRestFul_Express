let controller = {};
let service = require('./function');
let fs = require('fs').promises;
let moment = require('moment-timezone');

controller.registrasiMobil = async(req, res, next)=>{
	try{	
		let data = req.body;
		let getResponse;
		let response = await service.insertData(data);
		if(response.validationTypeMobil == true){
			if(response.dataInsert.validationPlatMobil == false){
				getResponse = await service.getMessage('01', 'Success', response.dataInsert.responseInsertData);
			}else{
				getResponse = await service.getMessage('01', 'Plat Mobil Sudah Ada', null);
			}
		}else{
			getResponse = await service.getMessage('02', 'Tipe Mobil Dilarang Parkir', null);
		}
		res.status(await service.getStatusResponse(getResponse.code)).json(getResponse);
	}catch(err){
		res.status(400).json(await service.getMessage('02', 'Error', err.message));
	}
}

controller.outDataParkirMobil = async(req, res, next)=>{
	try{
		let data = req.query;
		let result = await service.outDataParkirMobil(data);
		let getResponse = await service.getMessage('01', 'Success', result);
		res.status(await service.getStatusResponse(getResponse.code)).json(getResponse);
	}catch(err){
		res.status(400).json(await service.getMessage('02', 'Error', err.message));
	}
}

controller.getAllDataParkir = async(req, res, next)=>{
	try{
		let getAllData = await service.getAllDataParkir();
		let getResponse = await service.getMessage('01', 'Success', getAllData);
		res.status(await service.getStatusResponse(getResponse.code)).json(getResponse);
	}catch(err){
		res.status(400).json(await service.getMessage('02', 'Error', err.message));
	}
}

controller.getJumlahParkirByTipe = async(req, res, next)=>{
	try{
		let result = 0;
		let getResponse;
		let data = req.query;

		if(await service.validationTypeMobil(data) == true){
			result = await service.getCountTypeMobil(data.tipe);
			getResponse = await service.getMessage('01', 'Success', result);
		}else{
			getResponse = await service.getMessage('01', 'Tipe Mobil Tidak Ada', null);
		}
		res.status(await service.getStatusResponse(getResponse.code)).json(getResponse);
	}catch(err){
		res.status(400).json(await service.getMessage('02', 'Error', err.message));
	}
}

controller.getPlatNomorByWarna = async(req, res, next)=>{
	try{
		let warna = req.query.warna;
		let getResponse;
		let result = await service.getPlatNomorByWarna(warna);

		if(result.plat_nomor.length > 0){
			getResponse = await service.getMessage('01', 'Success', result);
		}else{
			getResponse = await service.getMessage('01', 'Data Kosong', result);
		}
		res.status(await service.getStatusResponse(getResponse.code)).json(getResponse);
	}catch(err){
		res.status(400).json(await service.getMessage('02', 'Error', err.message));
	}
}

controller.getAllReportParkirMobil = async(req, res, next)=>{
	try{
		let result = await service.getAllReportParkirMobil();
		if(result.length > 0){
			getResponse = await service.getMessage('01', 'Success', result);
		}else{
			getResponse = await service.getMessage('01', 'Data Kosong', result);
		}
		res.status(await service.getStatusResponse(getResponse.code)).json(getResponse);
	}catch(err){
		res.status(400).json(await service.getMessage('02', 'Error', err.message));
	}
}

module.exports = controller;