var mongo = require('mongodb');
var assert = require('assert');

// Config file
var configFile = require('./config.js');
var url = 'mongodb://'+configFile.mongohost+':'+configFile.mongoport+'/test';
console.log("connect url: ", url);
var db;

mongo.connect(url,
    function(err, database) {
        assert.equal(null, err);
        console.log("Connected to 'test' database");
        db=database;
    }
);

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving restaurant: ' + id);
    db
        .collection('restaurants')
        .find(
            {'_id': new mongo.ObjectID(id) }
        )
        .toArray(
            function(err, items) {
                res.send(items);
            }
        )
    ;
};

// findAll can take the following query parameters:
// ?limit: the number of items to return. default (5000)
// ?page: the page number to return. the first page is 1
exports.findAll = function(req, res) {
	// set defaults for query parameters
	var itemLimit= 5000;
	var page= 1;

	// check if the query parameters exist on the URL
	if(typeof req.query.limit !== "undefined") {
		itemLimit= Number(req.query.limit);
	} 
	if(typeof req.query.page !== "undefined") {
		page= Number(req.query.page);
	} 

	var skipItems= (page-1)*itemLimit;
	
	res.type('text/plain');
    db.collection('restaurants', function(err, collection) {
        collection
			.find()
			.skip(skipItems)
			.limit(itemLimit)
			.toArray(
				function(err, items) {
					console.log("Items: "+items.length);
					res.send(items);
				}
			)
		;
    });
};

exports.listNames = function(req, res) {
    // set defaults for query parameters
    var itemLimit= 50000;
    var page= 1;

    // check if the query parameters exist on the URL
    if(typeof req.query.limit !== "undefined") {
        itemLimit= Number(req.query.limit);
    }
    if(typeof req.query.page !== "undefined") {
        page= Number(req.query.page);
    }

    var skipItems= (page-1)*itemLimit;

    res.type('text/plain');
    db.collection('restaurants', function(err, collection) {
        collection
            .find({},{name: 1})
            .skip(skipItems)
            .limit(itemLimit)
            .toArray(
            function(err, items) {
                console.log("Items: "+items.length);
                res.send(items);
            }
        )
        ;
    });
};


exports.addRestaurant = function(req, res) {
    var restaurant = req.body;
    console.log('Adding restaurant: ' + JSON.stringify(restaurant));
    db.collection('restaurants', function(err, collection) {
        collection.insert(restaurant, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}


exports.updateRestaurant = function(req, res) {
    var id = req.params.id;
    var restaurant = req.body;
    console.log('Updating restaurant: ' + id);
    console.log(JSON.stringify(restaurant));
    db.collection('restaurants', function(err, collection) {
        collection.update({'_id': new mongo.ObjectID(id)}, restaurant, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating restaurant: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(restaurant);
            }
        });
    });
}

exports.deleteRestaurant = function(req, res) {
    var id = req.params.id;
    console.log('Deleting restaurant: ' + id);
    db.collection('restaurants', function(err, collection) {
        collection.remove({'_id':new mongo.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

