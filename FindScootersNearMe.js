
// using $near query operator
db.zipcodes.find().forEach(function(zipObj) {

    var point = {
        type: "Point",
        coordinates: [parseFloat(zipObj.properties.INTPTLON10), parseFloat(zipObj.properties.INTPTLAT10)]
    }

    var stats = db.scooters
        .find({location:{$near:{
            $geometry: point, 
            $minDistance: 10, 
            $maxDistance: 10000}},
            is_disabled: false,
            is_reserved: false 
        })
        .explain({executionStats:true}).executionStats;
    
    print("$near ZIP " + zipObj.properties.ZCTA5CE10 + " has " + stats.nReturned + ". scooters within 5 mile radius. Execution time (ms): " + stats.executionTimeMillis);
 });

// using $geoNear Aggregation operator
db.zipcodes.find().forEach(function(zip) {

    print ("=== My location is ZIP " + zip.properties.ZCTA5CE10 + " ===" );

    var point = {
        type: "Point",
        coordinates: [parseFloat(zip.properties.INTPTLON10), parseFloat(zip.properties.INTPTLAT10)]
    }

    db.scooters.aggregate([
        {
          $geoNear: {
             near: point,
             distanceField: "dist.calculated",
             maxDistance: 8000,
             query: { is_reserved: false, is_disabled: false },
             num: 5
          }
        }
     ]).forEach(function(scooter) {
        print("Scooter " + scooter._id + " is " + scooter.dist.calculated + " meters away from me");
     });
 });

// EXPLAIN - QUERY
db.scooters.find(
    { location : { $near : { type: "Point", "coordinates":[-105.0093868, 39.9758578]}, 
    $maxDistance: 8000 },
    is_disabled: false,
    is_reserved: false
}).explain({executionStats:true});

// EXPLAIN - AGG
db.scooters.explain({executionStats:true}).aggregate([
    {
      $geoNear: {
         near: { type: "Point", "coordinates":[-105.0093868, 39.9758578]},
         distanceField: "dist.calculated",
         maxDistance: 8000,
         query: { is_reserved: false, is_disabled: false },
         num: 5
      }
    }
 ]); 

 db.scooters.aggregate([
    {
      $geoNear: {
         
         distanceField: "dist.calculated",
         maxDistance: 8000,
         query: { is_reserved: false, is_disabled: false },
         num: 5
      }
    }
 ]).forEach(function(scooter) {
    print("Scooter " + scooter._id + " is " + scooter.dist.calculated + " meters away from me");
 });

db.scooters.find(
 {
    location: {
        $near: {
            type: "Point",
            coordinates: [-130, -80]
        },
        $maxDistance: 8000
      }
    }
);