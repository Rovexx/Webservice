var express = require('express');

var routes = function(Product){
    // router setup
    var productRouter = express.Router();

    var productController = require('../controllers/productController')(Product);
    productRouter.route('/')
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
            returnProduct.links = {};
            var newLink = 'http://' + req.headers.host + '/api/products/?brand=' + returnProduct.brand;
            returnProduct.links.FilterByThisBrand = newLink.replace(' ', '%20');
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
        });
    return productRouter;
};
module.exports = routes;