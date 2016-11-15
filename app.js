var express = require('express');
var player = require('chromecast-player')();
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var PORT = 3000;


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
		}
	}else{
		res.status(400).send();
	}
});

app.listen(PORT, function(){
	console.log("app is listening on port "+PORT);
});