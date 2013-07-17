var Geckoboard = require('geckoboard-push');
var config = require('./config.js');
var geck = new Geckoboard({api_key: config.GeckoAPIKey});
//var list = geck.list(config.GeckoWidget);
var gText = geck.text(config.GeckoWidget);

// Prep var
var items = [];

// Make a request to roomwarden API
require('request').get({ 
	uri:config.RoomwardenURL,
	headers:{'Accept':'application/json','Content-type':'application/json'},
	},function (err,res,body){
		var out = JSON.parse(body);
		console.log("config.RoomwardenURL = " + res.statusCode);
		buildItems(out);
	});


function buildItems(out){
// Build the variable/JSON for output
	out['item'].forEach(function(line) {
		console.log(line['text']);
        if(line['value'] == 'open'){var color = "#00FF00";}else{var color = "#FF0000";}
        items[items.length] = {
            "label": {
                "name": line['value'],
                "color": color
            },
            "title": {
                "text": line['text'],
                "highlight": true,
            },
            "description": "Since "+line['timeago']
        };


	});

	sendIt();
}

function sendIt(){
// Send the data to Geckoboard
console.log(items);
	list.send(items, function(err, response){
		console.log(response);
	});

}

