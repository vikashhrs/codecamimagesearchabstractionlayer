var express = require('express');
var PORT = process.env.PORT || 3000;
var mongoose = require('mongoose');
var app = express();
var History = require('./models/history');
var Bing = require('node-bing-api')({ accKey: "4ab617ba281b42e0b3e86e3353486106" });


mongoose.connect('mongodb://localhost/test');

app.get('/imagesearch/:query',function(request,response){
 	Bing.images(request.params.query, {
  		top: request.query.offset   // Number of results (max 50) 
  		//skip: 0    // Skip first 3 result 
  	}, function(error, res, body){
  		History.findOne({term : request.params.query},function(err,history){
  			if(err){
  				throw error
  			}
  			if(!history){
  				var newHistory = new History({
  					term: request.params.query,
					when: new Date().toLocaleString()
  				});

  				newHistory.save(function(err){
  					if(err){
  						throw err;
  					}
  				})
  			}
  		})
    	response.send(makeList(body.value));

    	function makeList(images) {
    		// Construct object from the json result
    		var newImageList = [];
    		
    		images.forEach(function(img){
    			var imgNew = {
	    			url: img.contentUrl,
	      			snippet: img.name,
	      			thumbnail: img.thumbnailUrl,
	      			context: img.hostPageUrl
    			}
    			console.log(imgNew);
    			newImageList.push(imgNew)
    		})
    		return newImageList;
}
  	});
});

// app.get('imagesearch/:query',function(req,res){
// 	console.log(req.params.query);
// 	console.log(req.query.offset);
// 	res.send("Processed");
// })

app.get('/recent',function(req,res){
	History.find(function(err,histories){
		if(err){
			throw err;
		}
		if(!histories){
			res.send("No search terms yet");
		}
		if(histories){
			res.send(histories);
		}
	})
})
app.listen(PORT,function(){
	console.log("Server running on port 3000");
})