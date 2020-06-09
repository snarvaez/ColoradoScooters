// nohup bash UpdateLocation.sh &>/dev/null &

// Create 5K upserts and bulk write

var _id_min = 1;
var _id_max = 999999

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
    
    var bulk = db.scooters.initializeUnorderedBulkOp();

    for (var i = 0; i < 5000; i++) {

        var _id = getRnd(_id_min, _id_max)|0;

        var point = {
            "type" : "Point",
            "coordinates" : [getRnd(lon_min, lon_max), getRnd(lat_min,lat_max)]
        }

        bulk.find( { "_id": _id } ).upsert().update(
            {
                $set: { "location": point },
                $set: { "is_reserved": getRndBool() },
                $set: { "is_disabled": getRndBool() }
            }
        );
    }

    bulk.execute();

    print(times + " iteration of 5K bulk updates DONE");
}

print("DONE!");