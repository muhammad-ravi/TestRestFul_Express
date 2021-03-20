let fs = require('fs').promises;
let moment = require('moment-timezone');
let service = {};

service.validasiJenisMobil = async(tipeMobil)=>{
	let result = false;
	if(tipeMobil == 'SUV' || tipeMobil == 'MPV'){
		result = true;
	}
	return result;
} 

service.getMessage = async(kode, message, data)=>{
	return {
		code: kode,
		message: message,
		data: data
	};
}

service.getStatusResponse = async(kode)=>{
	let statusResponse;
	if(kode == '01'){
		statusResponse = '200';
	}else if(kode == '02'){
		statusResponse = '400';
	}
	return statusResponse;
}

service.insertData = async(data)=>{
	let result = null;
	let validationTypeMobil = true;
	let responseData = null;
	if(await service.validationTypeMobil(data) == true){
			responseData = await service.doInsertData(data);
			result = await service.getOneDataParkirByPlat(responseData, data);
	}else{
		validationTypeMobil = false;
	}
	return {
		validationTypeMobil: validationTypeMobil,
		dataInsert: result
	};
}

service.getOneDataParkirByPlat = async(dataBase, data)=>{
	let result = null;
	if(dataBase.statusValidationPlatMobil == false){
		result = await service.getDataParkirByPlat(dataBase.responseInsertData, data);
	}
	return {
		validationPlatMobil: dataBase.statusValidationPlatMobil,
		responseInsertData: result
	};
}	

service.getDataParkirByPlat = async(dataBase, data)=>{
	let result = null;
	let getData = dataBase.filter((value)=> value.plat_nomor == data.plat_nomor);
	if(getData.length > 0){
		result = Object.assign({},{
					plat_nomor: getData[0].plat_nomor,
					parking_lot: getData[0].parking_lot,
					tanggal_masuk: getData[0].tanggal_masuk
				});
	}
	return result;
}

service.getAllDataParkir = async()=>{
	let result = [];
	let dataParkir = await fs.readFile('assets/inputan.txt', 'utf8');
	if(dataParkir.length > 0){
		let getData = JSON.parse(dataParkir);
		for(var i=0; i<getData.length; i++){
			result.push(Object.assign({},{
				plat_nomor: getData[i].plat_nomor,
				warna: getData[i].warna,
				tipe: getData[i].tipe,
				parking_lot: getData[i].parking_lot,
				tanggal_masuk: getData[i].tanggal_masuk
			}));
		}
	}
	return result;
}

service.getCountTypeMobil = async(tipe)=>{
	let dataBase = await fs.readFile('assets/inputan.txt', 'utf8');
	let dataParkirMobil = JSON.parse(dataBase);
	let filterDataParkir = dataParkirMobil.filter((value)=> value.tipe == tipe);
	let total = filterDataParkir.length;

	return{
		jumlah_kendaraan: total
	};
}

service.getPlatNomorByWarna = async(warna)=>{
	let result = [];
	let dataBase = await fs.readFile('assets/inputan.txt', 'utf8');
	let dataParkirMobil = JSON.parse(dataBase);
	let filterDataParkir = dataParkirMobil.filter((value)=> value.warna.toLowerCase() == warna.toLowerCase());
	if(filterDataParkir.length > 0){
		for(var i=0; i<filterDataParkir.length; i++){
			result.push(filterDataParkir[i].plat_nomor);
		}
	}
	return {
		plat_nomor: result
	}; 	
}

service.outDataParkirMobil = async(plat_nomor)=>{
	let result = null;
	let dataBase = await fs.readFile('assets/inputan.txt', 'utf8');
	if(dataBase.length > 0){
		let dataParkirMobil = JSON.parse(dataBase);
		let dataMobil = await service.getDataParkirByPlat(dataParkirMobil, plat_nomor);
		if(dataMobil != null){
			let tanggal_masuk = moment(dataMobil.tanggal_masuk);
			let tanggal_keluar =  moment().tz('Asia/Jakarta').format('YYYY-MM-DD hh:mm:ss')
			let getMilliSecond = moment.duration(moment(tanggal_keluar).diff(tanggal_masuk))._milliseconds;
			let hours = Math.floor(getMilliSecond/1000/3600);	
				dataMobil.tanggal_keluar = tanggal_keluar;
				dataMobil.jumlah_bayar = (hours > 1)? 25000 + (hours * 5000) : 25000;
			let postReport = await service.insertReportParkingMobil(dataMobil);
			delete dataMobil.parking_lot;
			result = dataMobil;
		}
	}
	return result;
}

service.insertReportParkingMobil = async(data)=>{
	let reportParkirMobil = await fs.readFile('assets/reports.txt', 'utf8');
	let postData = [];
	if(reportParkirMobil.length > 0){
		dataReport = JSON.parse(reportParkirMobil);
		dataReport.push(data);
		postData = dataReport;
	}else{
		postData.push(data);
	}
	await fs.writeFile('assets/reports.txt', JSON.stringify(postData));
	await service.deleteDataFromInputan(data);
}

service.deleteDataFromInputan = async(data)=>{
	let result = [];
	let dataBase = await fs.readFile('assets/inputan.txt', 'utf8');
	if(dataBase.length > 0){
		let dataMobil = JSON.parse(dataBase);
		let result = dataMobil.filter((value)=> value.plat_nomor != data.plat_nomor);
		if(result.length > 0){
			let postData = await fs.writeFile('assets/inputan.txt', JSON.stringify(result));
		}else{
			let postData = await fs.writeFile('assets/inputan.txt', '');
		}
	}
}

service.getAllReportParkirMobil = async()=>{
	let result = [];
	let reportParkirMobil = await fs.readFile('assets/reports.txt', 'utf8');
	if(reportParkirMobil.length > 0){
		result = JSON.parse(reportParkirMobil);
	}
	return result;
}

service.validationTypeMobil = async(data)=>{
	let validationTypeMobil = false;
	if(data.tipe == 'SUV' || data.tipe == 'MPV'){
		validationTypeMobil = true;
	}
	return validationTypeMobil
}


service.doInsertData = async(data)=>{
	let result;
	let checkData = await fs.readFile('assets/inputan.txt', 'utf8');
	if(checkData.length > 0){
		result = await service.postDataLengthMoreThanNol(data);
	}else if(checkData.length == 0){
		result = await service.postDataLengthNol(data);
	}
	return result;	
}

service.postDataLengthMoreThanNol = async(data)=>{
	let statusValidation = false;
	let dataBase = await fs.readFile('assets/inputan.txt', 'utf8');
	let dataInsertPrev = JSON.parse(dataBase);

	if(await service.validationPlatMobil(dataInsertPrev, data)){
		statusValidation = true;
	}else{
		data.parking_lot = 'A'+ await service.incrementParkingLot(dataInsertPrev.length);
		data.tanggal_masuk = moment().tz('Asia/Jakarta').format('YYYY-MM-DD hh:mm:ss');
		dataInsertPrev.push(data);
		await fs.writeFile('assets/inputan.txt', JSON.stringify(dataInsertPrev));		
	}
	return {
		statusValidationPlatMobil: statusValidation,
		responseInsertData: dataInsertPrev
	};
}

service.postDataLengthNol = async(data)=>{
	let postData = [];
	Object.assign(data,{
		parking_lot: 'A'+await service.incrementParkingLot(0),
		tanggal_masuk: moment().tz('Asia/Jakarta').format('YYYY-MM-DD hh:mm:ss')
	})
	postData.push(data);
	await fs.writeFile('assets/inputan.txt', JSON.stringify(postData));
	return {
		statusValidationPlatMobil: false,
		responseInsertData: postData
	};
}

service.validationPlatMobil = async(dataMobilParkir, dataMobilParkirBaru)=>{
	let statusValidation = false;
	let validationPlatMobil = dataMobilParkir.filter((value)=> value.plat_nomor == dataMobilParkirBaru.plat_nomor);
	if(validationPlatMobil.length > 0){
		statusValidation = true;
	}
	return statusValidation;
}

service.incrementParkingLot = async(data)=>{
	return ++data;
}

module.exports = service;