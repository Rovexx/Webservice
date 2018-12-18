let productController = function(Product){
    let post = function(req, res){
        let product = new Product(req.body);
        
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

    let get = function(req, res){
        // filter
        let query = {};
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
                let newProduct = element.toJSON();
                newProduct.links = {};
                newProduct.links.self = 'http://' + req.headers.host + '/api/products/' + newProduct._id
                newProduct.links.collection = 'http://' + req.headers.host + '/api/products/'
                returnProducts.push(newProduct);
            })
            // static pagination
            let pagination = {
                "currentPage": 1,
                "currentItems": 35,
                "totalPages": 1,
                "totalItems": 35,
                "_links": {
                    "first": {
                        "page": 1,
                        "href": "https://docent.cmi.hro.nl/bootb/demo/notes/"
                    },
                    "last": {
                        "page": 1,
                        "href": "https://docent.cmi.hro.nl/bootb/demo/notes/"
                    },
                    "previous": {
                        "page": 1,
                        "href": "https://docent.cmi.hro.nl/bootb/demo/notes/"
                    },
                    "next": {
                        "page": 1,
                        "href": "https://docent.cmi.hro.nl/bootb/demo/notes/"
                    }
                }
            }
            // returnProducts.pagination.currentpage = 1;
            // returnProducts.pagination.currentitems = 32;
            // returnProducts.pagination.totalpages = 32;

            // returnProducts.pagination.First = 'http://' + req.headers.host + '/api/products/';
            // returnProducts.pagination.Last = 'http://' + req.headers.host + '/api/products/';
            // returnProducts.pagination.Previous = 'http://' + req.headers.host + '/api/products/';
            // returnProducts.pagination.Next = 'http://' + req.headers.host + '/api/products/';
            // returnProducts.push(returnProducts.pagination);
            
            res.json({returnProducts,pagination});
        });
    }

    return{
        post: post,
        get: get
    }
}

module.exports = productController;