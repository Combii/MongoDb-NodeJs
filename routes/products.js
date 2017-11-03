const MongoClient = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const assert = require("assert");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
const mongoDbUrl = "mongodb://combii:1234@cluster-shard-00-00-uxhgu.mongodb.net:27017,cluster-shard-00-01-uxhgu.mongodb.net:27017,cluster-shard-00-02-uxhgu.mongodb.net:27017/zalandodummy?ssl=true&replicaSet=Cluster-shard-0&authSource=admin";

//Read (All)
app.get('/products', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('products');

        col.find().toArray().then((result) => {
            res.json(result)
        });

        db.close();
    }).catch((err) => {
        console.log('ERROR!: ' + err);
    });

});

//Read (One)
app.get('/products/:id', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('products');

        col.findOne({'_id': ObjectId(req.params.id)}).then((result) => {
            res.json(result);
        });

        db.close();
    }).catch((err) => {
        console.log('ERROR!: ' + err);
    });

});

// CREATE
app.post('/products/', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('products');

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
app.delete('/products/:id', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {
        var col = db.collection('products');

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
app.put('/products/:id', function (req, res) {

    MongoClient.connect(mongoDbUrl, function (err, db) {
        var col = db.collection('products');

        col.updateOne({'_id': ObjectId(req.params.id)}, {$set: req.body}, function (err, result) {
            res.status(204);
            res.json();
        });
        db.close();
    });
});


module.exports = app;