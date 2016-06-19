//Die beiden Module, die sich um die ToDo List bzw. die Kommunikation mit der WebUntis API kümmern
var apiAccess = require("./api.js");
var todoList = require("./todoList.js");

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
app.post("/authenticate", function(req, res) {
	apiAccess.getAuth(res, req.headers.username, req.headers.password);
});

app.get("/getSubjects", function(req, res) {
	apiAccess.mergedRequests(req.headers.sessionid, req.url.slice(1), res)
});

app.get("/getKlassen", function(req, res) {
	apiAccess.mergedRequests(req.headers.sessionid, req.url.slice(1), res)
});

app.post("/logout", function(req, res) {
	apiAccess.logout(req.headers.sessionid, res);
});

app.route("/todoList")
	.put(function(req, res) {
	todoList.writeToDatabase(req.headers.inhalt);
	res.end();
})
	.delete(function(req, res) {
	todoList.deleteFromDatabase(req.headers.inhalt);
	res.end();
})
	.get(function(req, res) {
	res.end(todoList.getList())
});

