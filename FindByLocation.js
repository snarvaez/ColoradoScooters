// 
// nohup bash FindByLocation.sh &>/dev/null &

// Secondary reads
db.getMongo().setSlaveOk();
db.getMongo().setReadPref('secondary');

// Array average
const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

// Scooter population
var _id_min = 1;
var _id_max = 600000

// Corners of the State of Colorado 
var lat_min = 37.020691;
var lat_max = 40.988098;
var lon_min = -109.015325;
var lon_max = -102.101746;

function getRnd(bottom, top) {
    return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

function getRndBool() {
    return Math.random() >= 0.5
}

for (var times= 0; times<86400; times ++) {
    
    var millis = [];
    
    for (var i = 1; i < 50; i++) {

        var point = {
            "type" : "Point",
            "coordinates" : [getRnd(lon_min, lon_max), getRnd(lat_min,lat_max)]
        }

        // using $geoNear Aggregation operator
        var start = Date.now();
        
        db.scooters.aggregate([
            { $geoNear: {
                near: point,
                distanceField: "dist.calculated",
                maxDistance: getRnd(500, 10000),
                query: { is_reserved: false, is_disabled: false },
                num: getRnd(2, 10) }
            }
        ]);

        millis.push(Date.now() - start);
    }
    print ("50 average $geoNear: " + average( millis ));
}