const MongoClient = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const assert = require("assert");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const mongoDbUrl = process.env.mongoDbUrl;

//Read (All)
app.get('/customers', function (req, res) {

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

    MongoClient.connect(mongoDbUrl, function (err, db) {
        var col = db.collection('customers');

        col.updateOne({'_id': ObjectId(req.params.id)}, {$set: req.body}, function (err, result) {
            res.status(204);
            res.json();
        });
        db.close();
    });
});


module.exports = app;