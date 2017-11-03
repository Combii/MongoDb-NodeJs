const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const mongoDbUrl = "mongodb://combii:1234@cluster-shard-00-00-uxhgu.mongodb.net:27017,cluster-shard-00-01-uxhgu.mongodb.net:27017,cluster-shard-00-02-uxhgu.mongodb.net:27017/zalandodummy?ssl=true&replicaSet=Cluster-shard-0&authSource=admin";


// ====================
// Orders =============
// ====================

//Read (All)
app.get('/orders', function (req, res) {

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

//Read (One)
app.get('/orders/:id', function (req, res) {

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
app.post('/orders/', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {

        var orderCol = db.collection('orders');
        var custCol = db.collection('customers');
        var prodCol = db.collection('products');

        var ordersTotal = {};

        custCol.findOne({'_id': ObjectId(req.params.id)}).then((result) => {
            ordersTotal.user = result;
            res.json(ordersTotal);
        });


        /*ordersTotal.products = [];

        req.body.products.forEach(function (element, index, array) {

            prodCol.findOne({'_id': ObjectId(element)}).then((result) => {
                ordersTotal.products.push(result);


                if (index === array.length - 1) {
                    orderCol.insertOne(ordersTotal, function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(201);
                            res.json({msg: 'Order Created'});
                            console.log(ordersTotal);
                        }
                    });
                    db.close();
                }

            });
        });*/


    });
});

// DELETE
app.delete('/orders/:id', function (req, res) {

    MongoClient.connect(mongoDbUrl, function (err, db) {
        var col = db.collection('orders');

        col.deleteOne({'_id': ObjectId(req.params.id)}, function (err, result) {
            res.status(204);
            res.json();

        });

        db.close();
    });
});


// UPDATE
app.put('/orders/:id', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('orders');

        col.updateOne({'_id': ObjectId(req.params.id)}, {$set: req.body}).then(() => {
            res.status(204);
            res.json();
        });
        db.close();
    });
});


module.exports = app;