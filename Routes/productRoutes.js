let express = require('express');

let routes = function(Product){
    // router setup
    let productRouter = express.Router();

    let productController = require('../Controllers/productController')(Product);
    productRouter.route('/')
        .post(productController.post)
        .get(productController.get)
        //Options collection
        .options(function(req, res){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, ContentType, Accept");
            res.header('Allow', 'GET,POST,OPTIONS');
            res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
            res.sendStatus(200);
        });

    // middleware
    productRouter.use('/:productId', function(req, res, next){
        Product.findById(req.params.productId, function(err, product){
            if(err)
                res.status(500).send(err);
            else if(product){
                req.product = product;
                next();
            }
            else{
                res.status(404).send('No product found');
            }
        });
    })

    //individual products
    productRouter.route('/:productId')
        .get(function(req, res){
            let returnProduct = req.product.toJSON();
            // links
            returnProduct._links = {};
            returnProduct._links.self = { 'href' : 'http://' + req.headers.host + '/api/products/' + returnProduct._id};
            returnProduct._links.collection = { 'href' : 'http://' + req.headers.host + '/api/products/'};
            let brandFilter = 'http://' + req.headers.host + '/api/products/?brand=' + returnProduct.brand;
            returnProduct._links.FilterByThisBrand = brandFilter.replace(' ', '%20');
            let nameFilter = 'http://' + req.headers.host + '/api/products/?name=' + returnProduct.name;
            returnProduct._links.FilterByThisName = nameFilter.replace(' ', '%20');
            res.json(returnProduct);

        })

        .put(function(req, res){
            if(!req.body.spoiled){
                res.status(400);
                res.send("Spoiled status is required");
            }
            else if(!req.body.name){
                res.status(400);
                res.send("Name is required");
            }
            else if(!req.body.brand){
                res.status(400);
                res.send("Brand is required");
            }
            else{
                req.product.spoiled = req.body.spoiled;
                req.product.name = req.body.name;
                req.product.brand = req.body.brand;
                req.product.save(function(err){
                    if(err)
                    res.status(500).send(err);
                    else{
                        res.json(req.product);
                    }
                });
            }
        })

        .patch(function(req, res){
            if(req.body._id){
                delete req.body._id;
            }
            for(let p in req.body){
                req.product[p] = req.body[p];
            }
            req.product.save(function(err){
                if(err)
                res.status(500).send(err);
                else{
                    res.json(req.product);
                }
            });
        })
        .delete(function(req, res){
            req.product.remove(function(err){
                if(err)
                res.status(500).send(err);
                else{
                    res.status(204).send('Removed');
                }
            });
        })
        //Options Detail
        .options(function(req, res){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, ContentType, Accept");
            res.header('Allow', 'GET,PUT,PATCH,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,DELETE,OPTIONS');
            res.sendStatus(200);
        });
    return productRouter;
};
module.exports = routes;