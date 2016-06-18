//Die beiden Module, die sich um die ToDo List bzw. die Kommunikation mit der WebUntis API kümmern
var apiAccess = require("./api.js");
var todoList = require("./todoList.js")

//Der Port, auf dem der Server läuft.
const PORT=8080;

//Deklariert den Server mit der Callback Methode
var express = require('express');
var cors = require("cors");
var app = express();
app.use(cors());

//Startet den Server
app.listen(PORT, function () {
	console.log('Server started on port %s', PORT);
});

//Verarbeiten der unterschiedlichen Requests
app.post(/get/, function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	apiAccess.authenticate(res,req.url.slice(1));
});

app.route("/todoList")
	.put(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	todoList.writeToDatabase(req.headers.inhalt);
	res.end();
})
	.delete(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	todoList.deleteFromDatabase(req.headers.inhalt);
	res.end();
})
	.get(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	res.end(todoList.getList())
});

