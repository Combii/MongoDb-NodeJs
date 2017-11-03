const MongoClient = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const assert = require("assert");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


const mongoDbUrl = "mongodb://combii:1234@cluster-shard-00-00-uxhgu.mongodb.net:27017,cluster-shard-00-01-uxhgu.mongodb.net:27017,cluster-shard-00-02-uxhgu.mongodb.net:27017/zalandodummy?ssl=true&replicaSet=Cluster-shard-0&authSource=admin";

/**
 * @param data._id
 * @param data.name
 * @param data.address
 * @param data.cpr   Information about the object's cpr number
 * */


//Read (All)
app.get('/customers', function (req, res) {

    /*MongoClient.connect(mongoDbUrl, function (err, db) {
        var col = db.collection('customers');

        col.find().toArray(function (err, result) {
            res.json(result);
        });

        db.close();
    });*/

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('customers');

        col.find().toArray().then((result) => {
            res.json(result)
        });

        db.close();
    }).catch((err) => {
        console.log('ERROR!: ' + err);
    });

});

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

//Read (One)
app.get('/customers/:id', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('customers');

        col.findOne({'_id': ObjectId(req.params.id)}).then((result) => {
            res.json(result);
        });

        db.close();
    }).catch((err) => {
        console.log('ERROR!: ' + err);
    });

});

// CREATE
app.post('/customers/', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('customers');

        col.insertOne(req.body).then(() => {
            res.status(201);
            res.json({msg: 'Customer Created'});
        }).catch((err) => {
            console.log('ERROR!: ' + err);
        });
        db.close();
    });
});

// Delete
app.delete('/customers/:id', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('customers');

        MongoClient.connect(mongoDbUrl).then(() => {
            col.deleteOne({_id: ObjectId(req.params.id)}).then((result) => {
                assert.equal(1, result.result.n);

                res.status(202);
                res.json({msg: 'Customer Deleted'});
            }).catch(() => {
                res.status(404);
                res.json({Error: "ERROR!: Could not delete user from MongoDB."});
            });
            db.close();
        });
    }).catch((err) => {
        console.log('ERROR!: ' + err);
    });

});

// UPDATE
app.put('/customers/:id', function (req, res) {

    MongoClient.connect(mongodburl, function (err, db) {
        var col = db.collection('customers');

        col.updateOne({'_id': ObjectId(req.params.id)}, {$set: req.body}, function (err, result) {
            res.status(204);
            res.json();
        });
        db.close();
    });
});


// CREATE Orders
/** @param req.body.products */
app.post('/orders/', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {

        var orderCol = db.collection('orders');
        var custCol = db.collection('customers');
        var prodCol = db.collection('products');

        var ordersTotal = {};

        custCol.findOne({ '_id': ObjectId(user) }).then((result) => {
            console.log(req.body.user);
            ordersTotal.user = result;
            console.log(ordersTotal);
            res.json(result);
        });


        var productsArray = [];

        req.body.products.forEach(function (element, index, array) {

            prodCol.findOne({ '_id': ObjectId(element) }).then((result) => {
                productsArray = result;
            });

            if (index === array.length - 1) {
                ordersTotal = productsArray;
            }

        });


        db.close();
    });
});

app.listen(process.env.port || 3000);

console.log("Listening on PORT 3000");