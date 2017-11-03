const app = require("express");
const MongoClient = require("mongodb");
const assert = require("assert");


const mongoDbUrl = "mongodb://combii:1234@cluster-shard-00-00-uxhgu.mongodb.net:27017,cluster-shard-00-01-uxhgu.mongodb.net:27017,cluster-shard-00-02-uxhgu.mongodb.net:27017/zalandodummy?ssl=true&replicaSet=Cluster-shard-0&authSource=admin";


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