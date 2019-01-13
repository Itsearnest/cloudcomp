var express = require("express"),
	app = express(),
	port = process.env.PORT || 1337,
	bodyParser = require('body-parser');;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require("./app/route/routes.js");
routes(app);
app.listen(port);

console.log("API Server started on port " + port);