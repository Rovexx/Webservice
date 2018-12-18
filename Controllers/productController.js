let productController = function(Product){
    let post = function(req, res){
        let product = new Product(req.body);
        
        if(!req.body.name){
            res.status(400);
            res.send("Name is required");
        }
        if(!req.body.brand){
            res.status(400);
            res.send("Brand is required");
        }
        if(!req.body.spoiled){
            res.status(400);
            res.send("Spoiled status is required");
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
            var items = [];
            products.forEach(function(element, index, array){
                let item = element.toJSON();
                item._links = {};
                item._links.self = { 'href' : 'http://' + req.headers.host + '/api/products/' + item._id};
                item._links.collection = { 'href' : 'http://' + req.headers.host + '/api/products/'};
                items.push(item);
            })
            let _links = {"self": {'href' : 'http://' + req.headers.host + '/api/products/'}}
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
           
            res.json({items,_links,pagination});
        });
    }

    return{
        post: post,
        get: get
    }
}

module.exports = productController;