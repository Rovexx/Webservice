var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var productModel = new Schema({
    name: {type: String},
    brand: {type: String},
    spoiled: {type: Boolean, default:false}
});

module.exports = mongoose.model('Product', productModel);