var express = require('express');
var player = require('chromecast-player')();
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var PORT = 3000;

// wemo
var Wemo = require('wemo-client');
var wemo = new Wemo();
var client;
wemo.discover(function(deviceInfo) {
	console.log('Wemo Device Found: %j', deviceInfo.friendlyName);
	// Get the client for the found device 
	client = wemo.client(deviceInfo);
});

// harmony
var harmony = require('harmonyhubjs-client');
var HarmonyClient;
var harmony_tv_id;



app.post('/chromecast', function(req, res){
	if (req.body.state) {
		if (req.body.state === 'play') {
			player.attach(function(err, p) {
				p.play();
				console.log('chromecast is playing');
			});
			res.status(200).send();
		}else if (req.body.state === 'pause'){
			player.attach(function(err, p) {
				p.pause();
				console.log('chromecast is paused');
			});
			res.status(200).send();
		}else{
			res.status(400).send();
		}
	}else{
		res.status(400).send();
	}
});

app.post('/wemo', function(req, res){
	if (req.body.state) {
		if (req.body.state === 'on'){
			// Turn the switch on 
			client.setBinaryState(1);
			res.status(200).send();
			console.log("wemo turned on");		
		}else if (req.body.state == 'off'){
			// Turn the switch off
			client.setBinaryState(0);
			res.status(200).send();
			console.log("wemo turned off");
		}else{
			res.status(400).send();
		}
	}else{
		res.status(400).send();
	}
});

app.post('/harmony', function(req, res){
	if (req.body.tv){
		if(req.body.tv === 'on'){
			harmony('192.168.2.16')
	.then(function(harmonyClient){
  		harmonyClient.getActivities()
        	.then(function(activities) {
            	activities.some(function(activity) {
              		if(activity.label === 'TV') {
              			harmonyClient.startActivity(activity.id);
						harmonyClient.end();
  					}
  				})
  			})
  		});
			
			res.status(200).send();
			console.log("TV turned on");
		}else if(req.body.tv === 'off'){
			harmony('192.168.2.16')
	.then(function(harmonyClient){
  		harmonyClient.getActivities()
        	.then(function(activities) {
            	activities.some(function(activity) {
              		if(activity.label === 'TV') {
              			harmonyClient.turnOff();
						harmonyClient.end();
  					}
  				})
  			})
  		});
			res.status(200).send();
			console.log("TV turned off");
		}else{
			res.status(400).send();
		}
	}else{
		res.status(400).send();
	}
});

app.listen(PORT, function(){
	console.log("app is listening on port "+PORT);
});