let express = require('express'),
    mongoose = require('mongoose');
    bodyParser = require('body-parser');
let db = mongoose.connect('mongodb://localhost/productAPI', { useNewUrlParser: true }).then(() => {
    console.log("Connected to Database");
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });
// create product model
let Product = require('./models/productModel');

// api setup
let app = express();
let port = process.env.PORT || 8000;

// bodyparser setup
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//options
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
    if (req.accepts('json' || 'xml' || 'x-www-form-urlencoded')) {
        next();
    } else {
        res.sendStatus(406);
    }
});

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