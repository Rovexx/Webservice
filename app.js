var express = require('express'),
    mongoose = require('mongoose');
    bodyParser = require('body-parser');
var db = mongoose.connect('mongodb://localhost/productAPI', { useNewUrlParser: true }).then(() => {
    console.log("Connected to Database");
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });
// create product model
var Product = require('./models/productModel');

// api setup
var app = express();
var port = process.env.PORT || 8000;

// bodyparser setup
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// router
productRouter = require('./Routes/productRoutes')(Product);

app.use('/api/products', productRouter);
//app.use('/api/brands', brandRouter);

app.get('/', function(req, res){
    res.send('Welcome to my API');
});

app.listen(port, function(){
    console.log('Running on PORT: ' + port);
});