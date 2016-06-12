//Importieren/Requiren von den benötigten Modulen
var http = require('http');
var dispatcher = require('httpdispatcher');

//Der Port, auf dem der Server läuft.
const PORT=8080;

//Die Variable, die die jetzige Sesion speichert
var ergebnis;
//Diese Mehotde verarbeitet alle Anfragen an der Server
function handleRequest(request, response){
	try {
		//log the request on console
		console.log(request.url);
		//Disptach
		dispatcher.dispatch(request, response);
	} catch(err) {
		console.log(err);
	}
}

//Deklariert den Server mit der Callback Methode
var server = http.createServer(handleRequest);

//Startet den Server
server.listen(PORT, function(){
	console.log("Server listening on: http://localhost:%s", PORT);
});

//Verarbeiten die beiden unterschiedlichen Requests
dispatcher.onPost("/getSubjects", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	authenticate(res,"getSubjects"); //TODO: req für routing benutzen
});

dispatcher.onPost("/getClasses", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});

	authenticate(res,"getKlassen"); //TODO: req für routing benutzen
})

//Authentifiziert den Server mit einer neuen SessionID
function authenticate(request, type)
{
	if(ergebnis!=null)
	{
		logout(ergebnis.result.sessionId)
		console.log("Abgemeldet")
	}
	var http = require("https");

	var options = {
		"method": "POST",
		"hostname": "stundenplan.hamburg.de",
		"port": null,
		"path": "/WebUntis/jsonrpc.do?school=HH5888",
		"headers": {
			"cache-control": "no-cache"
		}
	};

	var req = http.request(options, function (res) {
		var chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		var returnValue;

		res.on("end", function () {
			var body = Buffer.concat(chunks);
			ergebnis = JSON.parse(body.toString())
			console.log(ergebnis.result.sessionId)
			routing(ergebnis.result.sessionId, type, request);
		});
	});

	req.write("{\n    \"id\": \"ID\",\n    \"method\": \"authenticate\",\n    \"params\": {\n        \"user\": \"HWG\",\n        \"password\": \"WMS4\",\n        \"client\": \"Client\"\n        },\n    \"jsonrpc\": \"2.0\"\n}");
	req.end();
}

//Eine Routing Methode
function routing(sessionId, type, request) {
	if (type == "getSubjects")
	{
		getSubjects(sessionId, request)
	}
	else if (type == "getKlassen")
	{
		getClasses(sessionId, request)
	}
}

//Holt alle Fächer von der API und gibt sie an den Request zurück.
function getSubjects(sessionID, request)
{
	var http = require("https");

	var options = {
		"method": "POST",
		"hostname": "stundenplan.hamburg.de",
		"port": null,
		"path": "/WebUntis/jsonrpc.do;jsessionid=" + sessionID + "?school=HH5888",
		"headers": {
			"cache-control": "no-cache",
			"JSESSIONID": sessionID
		}
	};

	var req = http.request(options, function (res) {
		var chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			var body = Buffer.concat(chunks);
			console.log("gotSubjects")
			request.end(body.toString())
		});
	});

	req.write("{\"id\":\"ID\",\"method\":\"getSubjects\",\"jsonrpc\":\"2.0\"}");
	req.end();
}

//Holt alle Klassen/Gruppen von der API und gibt sie an den Request zuück.5
function getClasses(sessionID, request)
{
	var http = require("https");

	var options = {
		"method": "POST",
		"hostname": "stundenplan.hamburg.de",
		"port": null,
		"path": "/WebUntis/jsonrpc.do;jsessionid=" + sessionID + "?school=HH5888",
		"headers": {
			"cache-control": "no-cache",
			"JSESSIONID": sessionID
		}
	};

	var req = http.request(options, function (res) {
		var chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			var body = Buffer.concat(chunks);
			console.log("gotClasses")
			console.log(body.toString())
			request.end(body.toString())
		});
	});

	req.write("{\"id\":\"ID\",\"method\":\"getKlassen\",\"jsonrpc\":\"2.0\"}");
	req.end();
}


//Meldet den Server ab.
function logout(sessionId)
{
	var http = require("https");

	var options = {
		"method": "POST",
		"hostname": "stundenplan.hamburg.de",
		"port": null,
		"path": "/WebUntis/jsonrpc.do;jsessionid=" + sessionId + "?school=HH5888",
		"headers": {
			"cache-control": "no-cache",
			"JSESSIONID": sessionId
		}
	};

	var req = http.request(options, function (res) {});

	req.write("{\"id\":\"ID\",\"method\":\"logout\",\"params\":{},\"jsonrpc\":\"2.0\"}");
	req.end();
}


