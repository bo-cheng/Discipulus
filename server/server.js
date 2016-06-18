var apiAccess = require("./api.js");
var todoList = require("./todoList.js")

var cors = require("cors");

//Der Port, auf dem der Server läuft.
const PORT=8080;

//Deklariert den Server mit der Callback Methode
var express = require('express');
var app = express();
app.use(cors());

//Startet den Server
app.listen(PORT, function () {
	console.log('Example app listening on port %s!', PORT);
});

//Verarbeiten die beiden unterschiedlichen Requests
app.post("/getSubjects", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	apiAccess.authenticate(res,"getSubjects"); //FUTURE: req für routing benutzen
});
app.post("/getClasses", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	apiAccess.authenticate(res,"getKlassen"); //FUTURE: req für routing benutzen
});
app.put("/todoList", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	todoList.writeToDatabase(req.headers.inhalt);
	res.end();
})
app.delete("/todoList", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	todoList.deleteFromDatabase(req.headers.inhalt);
	res.end();
})
app.get("/todoList", function(req, res) {
	console.log("GET /todoList")
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	console.log(todoList.getList());
	res.end(todoList.getList())
})
