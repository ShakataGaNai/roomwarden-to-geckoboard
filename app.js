var Geckoboard = require('geckoboard-push');
var config = require('./config.js');
var geck = new Geckoboard({api_key: config.GeckoAPIKey});
var gText = geck.text(config.GeckoWidget);

// Prep var
var items;
var items2;


function room(){
    // Make a request to roomwarden API
    console.log('This is Red Five; I\'m going in! '+getDateTime());

    require('request').get({ 
    	uri:config.RoomwardenURL,
    	headers:{'Accept':'application/json','Content-type':'application/json'},
    	},function (err,res,body){
    		var out = JSON.parse(body);
    		console.log('config.RoomwardenURL = ' + res.statusCode);
            if(res.statusCode == 200){
                //It worked, move on
                buildItems(out);
            }else{
                // Didn't work, wait and try again.
                setTimeout(room,5000);
            }
    		
    	});
}

function buildItems(out){
    // Build the variable/JSON for output
    items = '<font size="-1">';
	out['item'].forEach(function(line) {
        if(line['value'] == 'open'){var color = "#00FF00";}else{var color = "#FF0000";}
        items += '<div style="background-color:'+color+'; color: #FFFFFF;">'+line['value']+' -- '+line['text']+'</div>';
        items += '<div> Since '+line['timeago']+'</div><br>'+"\n";
	});
    items += '<br>'+getDateTime()+'</font>';
    items2 = {"text" : items};
	sendIt();
}

function sendIt(){
    // Send the data to Geckoboard
	gText.send(items2, function(err2, res2){
        if(!err2){
            if(res2['success'] == true){
                // We're done here! Wait for 45 seconds
                console.log('sendIt - OK');
                setTimeout(room,45000);
            }else{
                // Didn't work, wait and try again
                console.log(res2);
                setTimeout(sendIt,5000);
            }
        }else{
            console.log(err2);
            setTimeout(sendIt,5000);
        }
	});
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

//Starts the loop the first time
room();