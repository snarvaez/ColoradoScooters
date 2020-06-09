// Find in which zipcode is each scooter located in
db.scooters.find().forEach(function(scooter) {
    db.zipcodes
        .find({geometry:{$geoIntersects:{$geometry: scooter.location}}})
        .forEach(function(zip) {
            print("Scooter " + scooter._id + " is in zipcode: " + zip.properties.ZCTA5CE10 )
        })
});

db.zipcodes.find().forEach(function(zip) {
    var stats = db.scooters
        .find({location:{$geoIntersects:{$geometry: zip.geometry}}})
        .explain({executionStats:true}).executionStats;
    
    print("$geoIntersects ZIP " + zip.properties.ZCTA5CE10 + " has " + stats.nReturned + ". scooters. Execution time (ms): " + stats.executionTimeMillis);
});

// Find the scooters inside each zip code
db.zipcodes.find().forEach(function(zip) {
    var stats = db.scooters
        .find({location:{$geoWithin:{$geometry: zip.geometry}}})
        .explain({executionStats:true}).executionStats;
    
    print("$geoWithin ZIP " + zip.properties.ZCTA5CE10 + " has " + stats.nReturned + ". scooters. Execution time (ms): " + stats.executionTimeMillis);
});

// For benchmarking
db.zipcodes.find().forEach(function(zip) {
    var stats = db.scooters
        .find({location:{$geoWithin:{$geometry: zip.geometry}}})
        .explain({executionStats:true}).executionStats;
    
    print(stats.nReturned + "|" + stats.executionTimeMillis);
});




