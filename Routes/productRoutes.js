var express = require('express');

var routes = function(Product){
    // router setup
    var productRouter = express.Router();

    var productController = require('../Controllers/productController')(Product);
    productRouter.route('/')
        //Options collection
        .options(function(req, res){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, ContentType, Accept");
            res.header('Allow', 'GET,POST,OPTIONS');
            res.header('Access-Control-Allow-Methods', 'HEAD,GET,POST,OPTIONS');
            res.send(200);
        })
        .post(productController.post)
        .get(productController.get);

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
            var returnProduct = req.product.toJSON();
            // links
            returnProduct.links = {};
            var brandFilter = 'http://' + req.headers.host + '/api/products/?brand=' + returnProduct.brand;
            returnProduct.links.FilterByThisBrand = brandFilter.replace(' ', '%20');
            var nameFilter = 'http://' + req.headers.host + '/api/products/?name=' + returnProduct.name;
            returnProduct.links.FilterByThisName = nameFilter.replace(' ', '%20');
            res.json(returnProduct);
        })

        .put(function(req, res){
            req.product.name = req.body.name;
            req.product.brand = req.body.brand;
            req.product.spoiled = req.body.spolied;
            req.product.save(function(err){
                if(err)
                res.status(500).send(err);
                else{
                    res.json(req.product);
                }
            });
        })

        .patch(function(req, res){
            if(req.body._id){
                delete req.body._id;
            }
            for(var p in req.body){
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
            res.header('Access-Control-Allow-Methods', 'HEAD,GET,PUT,PATCH,DELETE,OPTIONS');
            res.send(200);
        });
    return productRouter;
};
module.exports = routes;