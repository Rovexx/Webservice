let productController = function(Product){
    let post = function(req, res){
        let product = new Product(req.body);
        
        if(!req.body.name){
            res.status(400);
            res.send("Name is required");
        }
        else if(!req.body.brand){
            res.status(400);
            res.send("Brand is required");
        }
        else if(!req.body.spoiled){
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
            // pagination
            let limit = 5;
            let currentPage = 0;
            let totalItems = products.length;
            let totalPages = Math.ceil(totalItems/limit);
            let currentItems = (totalItems-(currentPage*limit));
            let lastPage = (totalPages-1);
            let previousPage = 0;
            let nextPage = 0;
            
            let previousPageCalc = function(){
                if (currentPage != 0){previousPage = (currentPage - 1);}
            };
            let nextPageCalc = function(){
                if (currentPage != lastPage){nextPage = (currentPage + 1);}
            };
            previousPageCalc();
            nextPageCalc();
            let pagination = {
                "currentPage": currentPage,
                "currentItems": currentItems,
                "totalPages": totalPages,
                "totalItems": totalItems,
                "_links": {
                    "first": {
                        "page": 0,
                        "href": 'http://' + req.headers.host + '/api/products/&page=0'
                    },
                    "last": {
                        "page": totalPages,
                        "href": 'http://' + req.headers.host + '/api/products/&page=' + lastPage
                    },
                    "previous": {
                        "page": previousPage,
                        "href": 'http://' + req.headers.host + '/api/products/&page=' + previousPage
                    },
                    "next": {
                        "page": nextPage,
                        "href": 'http://' + req.headers.host + '/api/products/&page=' + nextPage
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