var productController = function(Product){
    var post = function(req, res){
        var product = new Product(req.body);
        
        if(!req.body.name){
            res.status(400);
            res.send("Name is required");
        }
        else{
            //save the product
            product.save();
            //send status back
            res.status(201)
            res.send(product);
        }
    }

    var get = function(req, res){
        // filter
        var query = {};
        if (req.query.name){
            query.name = req.query.name;
        }
        if (req.query.brand){
            query.brand = req.query.brand;
        }
        Product.find(query, function(err, products){
            if(err)
                res.status(500).send(err);
            else
            var returnProducts = [];
            products.forEach(function(element, index, array){
                var newProduct = element.toJSON();
                newProduct.links = {};
                newProduct.links.self = 'http://' + req.headers.host + '/api/products/' + newProduct._id
                returnProducts.push(newProduct);
            })
            res.json(returnProducts);
        });
    }

    return{
        post: post,
        get: get
    }
}

module.exports = productController;