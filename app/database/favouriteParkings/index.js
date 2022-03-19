import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'Customers.db' });

exports.createTableFavouriteParkings = () => {
    
    try{
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='favourite_parkings'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS favourite_parkings', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS favourite_parkings(id INTEGER PRIMARY KEY AUTOINCREMENT, uniquePId INTEGER, client_id INTEGER,  name VARCHAR(255), phone_number VARCHAR(25), address VARCHAR(255), description TEXT, opens_at TEXT, closes_at TEXT, latitude DOUBLE, longitude DOUBLE, rating DOUBLE, total_space INTEGER, current_free_space INTEGER,  photo VARCHAR(255))',
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
        
        
        exports.getFavouriteParkings = (callback) => {
            try{
                db.transaction((tx) => {
                    tx.executeSql(
                        "SELECT * FROM favourite_parkings",
                        [],
                        (tx, results) => {
                            var favourite_parkings = [];
                            for (let i = 0; i < results.rows.length; ++i){
                                favourite_parkings.push(results.rows.item(i));
                            }
                            callback(favourite_parkings)
                        });
                    });
                }catch(error){
                    throw error;
                }
            }
            
            
            exports.addParkingIntoFavourites = (parking, callback) => {
                try{
                    db.transaction(function (tx) {
                        tx.executeSql(
                            'INSERT INTO favourite_parkings (uniquePId, client_id, name, phone_number, address, description, opens_at, closes_at, latitude, longitude, rating, total_space, current_free_space, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [
                                parking.id, parking.client_id, parking.name, parking.phone_number,
                                parking.address, parking.description, parking.opens_at, parking.closes_at,
                                parking.latitude, parking.longitude, parking.rating, parking.total_space,
                                parking.current_free_space, parking.photo
                            ],
                            (tx, results) => {
                                results.rowsAffected > 0 ? callback(true) : callback(false);
                            }
                            );
                        });
                    }catch(error){
                        console.log("Got error on adding parking into favourites", error.message);
                        throw error;
                    }
                }
                
          
                    
                    exports.removeParkingFromFavourites = (parking, callback) => {
                        try{
                            db.transaction((tx) => {
                                tx.executeSql(
                                    'DELETE FROM favourite_parkings where id=? AND uniquePId=?',
                                    [parking.id, parking.uniquePId],
                                    (tx, results) => {
                                        results.rowsAffected > 0 ? callback(true) : callback(false);
                                    });
                                });
                            }catch(error){
                                throw error;
                            }
                        }
                        
                        
                        exports.doesParkingExistinFavourites = (parkingId, callback) => {
                            try{
                                db.transaction(function (tx) {
                                    tx.executeSql(
                                        "SELECT * FROM favourite_parkings WHERE uniquePId = ?",
                                        [parkingId],
                                        (tx, results) => {
                                            if(results.rows.length > 0){
                                                console.log("row exists")
                                                callback(true) 
                                            }else{
                                                console.log("No rows")
                                                callback(false);
                                            } 
                                        }
                                        );
                                    });
                                }catch(error){
                                    console.log("Got error on checking if parking area exists in favourites", error.message);
                                    throw error;
                                }
                            }
                            
                            
                      