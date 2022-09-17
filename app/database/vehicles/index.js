import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'Customers.db' });

exports.createVehiclesTable = () => {
    
    try{
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='vehicles'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS vehicles', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS vehicles(id INTEGER PRIMARY KEY AUTOINCREMENT, number VARCHAR(20) NOT NULL UNIQUE, name VARCHAR(30) NOT NULL,  type VARCHAR(20) NOT NULL)',
                            []
                            );
                        }
                    }
                    );
                });
            }catch(error){
                throw error;
            }
        }
        
        
        exports.getVehicles = (callback) => {
            try{
                db.transaction((tx) => {
                    tx.executeSql(
                        "SELECT * FROM vehicles",
                        [],
                        (tx, results) => {
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i){
                                temp.push(results.rows.item(i));
                            }
                            callback(temp)
                        });
                    });
                }catch(error){
                    throw error;
                }
            }
            
            
            exports.insertVehicle = (vehicle, callback) => {
                try{
                    db.transaction(function (tx) {
                        tx.executeSql(
                            'INSERT INTO vehicles (number, name, type) VALUES (?, ?, ?)',
                            [convertToVehicleNumber(vehicle.number), capitalizeFirstLetter(vehicle.name), vehicle.type],
                            (tx, results) => {
                                results.rowsAffected > 0 ? callback(true) : callback(false);
                            }
                            );
                        });
                    }catch(error){
                        console.log("Got error on adding vehicle", error.message);
                        throw error;
                    }
                }
                
                exports.updateVehicleDetails = (vehicle, callback) => {
                    try{
                        db.transaction((tx) => {
                            tx.executeSql(
                                'UPDATE vehicles set number=?, name=?, type=? where id=?',
                                [convertToVehicleNumber(vehicle.number), capitalizeFirstLetter(vehicle.name), vehicle.type, vehicle.id],
                                (tx, results) => {
                                    results.rowsAffected > 0 ? callback(true) : callback(false);
                                }
                                );
                            });
                        }catch(error){
                            throw error
                        }
                    }
                    
                    exports.deleteVehicle = (VehicleId, callback) => {
                        try{
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'DELETE FROM vehicles where id=?',
                                    [VehicleId],
                                    (tx, results) => {
                                        results.rowsAffected > 0 ? callback(true) : callback(false);
                                    });
                                });
                            }catch(error){
                                throw error;
                            }
                        }
                        
                        
                        exports.searchVehicle = (number, name, callback) => {

                            try{
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        'SELECT * FROM vehicles where number=? AND name=?',
                                        [number, name],
                                        (tx, results) => {
                                            var len = results.rows.length;
                                            if (len > 0) {
                                              let res = results.rows.item(0);
                                              callback(res);
                                            }
                                        });
                                    });
                                }catch(error){
                                    throw error;
                                }
                            }
                            
                            
                            exports.doesVehicleExist = (vehicle, callback) => {
                                try{
                                    const vehicle_number = trimString(vehicle.number.trim().toLowerCase());
                                    db.transaction(function (tx) {
                                        tx.executeSql(
                                            "SELECT * FROM vehicles WHERE LOWER(REPLACE(REPLACE(REPLACE(`number`, ' ', ''), '\t', ''), '\n', ''))=?",
                                            [vehicle_number],
                                            (tx, results) => {
                                                if(results.rows.length > 0){
                                                    callback(true) 
                                                }else{
                                                    callback(false);
                                                } 
                                            }
                                            );
                                        });
                                    }catch(error){
                                        console.log("Got error on checking if vehicle exists", error.message);
                                        throw error;
                                    }
                                }
                                
                                
                                function trimString(str){
                                    try{
                                        let regex = /[.,\s]/g;
                                        let formattedStr = str.replace(regex, '');
                                        return formattedStr;
                                    }catch(err){
                                        throw err;
                                    }
                                }
                                
                                function capitalizeFirstLetter(str) {
                                    return str.charAt(0).toUpperCase() + str.slice(1);
                                }
                                
                                function convertToVehicleNumber(str){
                                    const position = 3
                                    let regex = /[.,\s]/g;
                                    str= str.replace(regex, '');
                                    str = [str.slice(0, position), str.slice(position)].join(' ');
                                    return str.toUpperCase();
                                }