const MongoClient = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');

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

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});


// CREATE Orders
/** @param req.body.products */
app.post('/orders/', function (req, res) {

    MongoClient.connect(mongoDbUrl).then((db) => {

        var orderCol = db.collection('orders');
        var custCol = db.collection('customers');
        var prodCol = db.collection('products');

        var ordersTotal = {};

        custCol.findOne({'_id': ObjectId(user)}).then((result) => {
            console.log(req.body.user);
            ordersTotal.user = result;
            console.log(ordersTotal);
            res.json(result);
        });


        var productsArray = [];

        req.body.products.forEach(function (element, index, array) {

            prodCol.findOne({'_id': ObjectId(element)}).then((result) => {
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