const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
//const mongodburl = 'mongodb://clbo:1234@cluster0-shard-00-00-9zvke.mongodb.net:27017,cluster0-shard-00-01-9zvke.mongodb.net:27017,cluster0-shard-00-02-9zvke.mongodb.net:27017/zalandodummy?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
// const mongodburl = require('../util/mongourl.js');

const mongodburl = require('../util/mongourl.json').url;


// ===================
// Products ===========
// ====================
// READ (all)
app.get('/products', function (req, res) {
    MongoClient.connect(mongodburl, function (err, db) {

        var col = db.collection('products');
        // Read All
        col.find().toArray(function (err, result) {
            //console.log(result);
            res.json(result);
        });
        db.close();
    });
});
// READ (one)
app.get('/products/:id', function (req, res) {

    MongoClient.connect(mongodburl, function (err, db) {
        var col = db.collection('products');

        col.findOne({ '_id': ObjectId(req.params.id) }, function (err, result) {
            res.json(result);
        })
        db.close();
    });
});
// CREATE
app.post('/products/', function (req, res) {

    MongoClient.connect(mongodburl, function (err, db) {
        var col = db.collection('products');

        col.insertOne(req.body, function (err, result) {
            res.status(201);
            res.json({ msg: 'Customer Created' });
        })
        db.close();
    });
});
// DELETE
app.delete('/products/:id', function (req, res) {

    MongoClient.connect(mongodburl, function (err, db) {
        var col = db.collection('products');

        col.deleteOne({ '_id': ObjectId(req.params.id) }, function (err, result) {
            res.status(204);
            res.json();

        });

        db.close();
    });
});


// UPDATE
app.put('/products/:id', function (req, res) {
    
        MongoClient.connect(mongodburl, function (err, db) {
            var col = db.collection('products');
    
            col.updateOne({ '_id': ObjectId(req.params.id) }, {$set : req.body}, function(err, result){
                res.status(204);
                res.json();
            });
            db.close();
        });
    });


// UPDATE
app.put('/customers/:id', function (req, res) {
    
        MongoClient.connect(mongodburl, function (err, db) {
            var col = db.collection('customers');
    
            col.updateOne({ '_id': ObjectId(req.params.id) }, {$set : req.body}, function(err, result){
                res.status(204);
                res.json();
            });
            db.close();
        });
    });


    module.exports = app;