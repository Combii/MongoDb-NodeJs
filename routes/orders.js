const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
//const mongodburl = 'mongodb://clbo:1234@cluster0-shard-00-00-9zvke.mongodb.net:27017,cluster0-shard-00-01-9zvke.mongodb.net:27017,cluster0-shard-00-02-9zvke.mongodb.net:27017/zalandodummy?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
const mongodburl = require('../util/mongourl.js');




// ===================
// Orders ===========
// ====================
// READ (all)
app.get('/orders', function (req, res) {
    MongoClient.connect(mongodburl, function (err, db) {

        var col = db.collection('orders');
        // Read All
        col.find().toArray(function (err, result) {
            //console.log(result);
            res.json(result);
        });
        db.close();
    });
});
// READ (one)
app.get('/orders/:id', function (req, res) {

    MongoClient.connect(mongodburl, function (err, db) {
        var col = db.collection('orders');

        col.findOne({ '_id': ObjectId(req.params.id) }, function (err, result) {
            res.json(result);
        })
        db.close();
    });
});
// CREATE
app.post('/orders/', function (req, res) {

    MongoClient.connect(mongodburl, function (err, db) {
       
        var orderCol = db.collection('orders');
        var custCol = db.collection('customers');
        var prodCol = db.collection('products');

        var ordersTotal = {};

        custCol.findOne({ '_id': ObjectId(req.body.user) }, function(err, result){         
                ordersTotal.user = result;      
        });

        ordersTotal.products = [];

        req.body.products.forEach(function(element, index, array) {
            
            prodCol.findOne({ '_id': ObjectId(element) }, function(err, result){
                ordersTotal.products.push(result);
             

                if(index === array.length-1) {
                    orderCol.insertOne(ordersTotal, function (err, result) {
                        if(err){
                            console.log(err);
                        } else {
                            res.status(201);
                            res.json({ msg: 'Order Created' });
                            console.log(ordersTotal);
                        }
                    })
                    db.close();
                }

            });
        });


       
    });
});
// DELETE
app.delete('/orders/:id', function (req, res) {

    MongoClient.connect(mongodburl, function (err, db) {
        var col = db.collection('orders');

        col.deleteOne({ '_id': ObjectId(req.params.id) }, function (err, result) {
            res.status(204);
            res.json();

        });

        db.close();
    });
});


// UPDATE
app.put('/orders/:id', function (req, res) {
    
        MongoClient.connect(mongodburl, function (err, db) {
            var col = db.collection('orders');
    
            col.updateOne({ '_id': ObjectId(req.params.id) }, {$set : req.body}, function(err, result){
                res.status(204);
                res.json();
            });
            db.close();
        });
    });


    module.exports = app;