const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const customersModule = require(__dirname + './routes/customers.js');
app.use(customersModule);

const productsModule = require(__dirname + './routes/products.js');
app.use(productsModule);

const ordersModule = require(__dirname + './routes/orders.js');
app.use(ordersModule);

app.listen(process.env.port || 3000);

console.log("Listening on PORT 3000");