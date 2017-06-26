var mongoose = require('mongoose');
var History = mongoose.Schema({
    term : {
    	type : String,
    	required :true
    },
    when : {
    	type : String,
    	required : true
    }
});
module.exports = mongoose.model('History',History); 