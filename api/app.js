var _ = require('underscore');
var restify = require('restify');
var Forecast = require('forecast');

var forecast = new Forecast({
	service: 'forecast.io',
	key: process.env.FORECAST_API_KEY,
	units: 'fahrenheit',
	cache: true,
	ttl: {
		minutes: 15,
		seconds: 0
	}
});

var server = restify.createServer({
	name: 'weather-cloud',
	version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/api/weather', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	forecast.get([process.env.LATITUDE, process.env.LONGITUDE], function(err, weather) {
		if (err) return console.dir(err);
		var result = _.pick(weather,
			'latitude',
			'longitude',
			'timezone',
			'currently',
			'expires'
		);
		res.send(result);
	});
});

server.listen(process.env.PORT || 3030, function() {
	console.log('%s listening at %s', server.name, server.url);
});
