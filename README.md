# TestRestFul_Express

cara menjalankan program

1. Install NodeJs & Npm jika belum ada.
2. npm install
3. npm start 


Rest Ful ini terdiri atas beberapa route
1. GET
    1. melihat semua data registrasi mobil yang terpakir.
       http://localhost:3000/api/getAllDataParkir (untuk melihat data registrasi mobil yang terparkir)
    
    2. mengeluarkan kendaraan yang terparkir
       http://localhost:3000/api/OutDataParkirMobil?plat_nomor= (pilih plat nomor )
    
    3. melihat report jumlah per tipe mobil
       http://localhost:3000/api/getJumlahParkirByTipe?tipe=MPV
    
    4. melihat list nomor kendaraan sesuai warna
      http://localhost:3000/api/getPlatNomorByWarna?warna=hitam
    
    5. melihat report data kendaraan yang telah keluar
      http://localhost:3000/api/getAllReportParkirMobil
2. POST
      1. melakukan registrasi kendaraan
        http://localhost:3000/api/insertDataParkir, 
          data Request = {
                            "plat_nomor": "B 3198 AC",
                            "warna": "Hitam",
                            "tipe": "SUV"
                         } 
