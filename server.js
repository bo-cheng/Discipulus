//Importieren/Requiren von den benötigten Modulen
var http = require('http');
var dispatcher = require('httpdispatcher');

//Der Port, auf dem der Server läuft.
const PORT=8080;

//Die verschieden Adressteile, die bei der Kommunikation mit der API benötigt werden
const baseAdress = "stundenplan.hamburg.de";
const relativeAdressUnauthenticated = "/WebUntis/jsonrpc.do?school=HH5888";
const relativeAdressAuthenticated1 = "/WebUntis/jsonrpc.do;jsessionid=";
const relativeAdressAuthenticated2 = "?school=HH5888";

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
	authenticate(res,"getSubjects"); //FUTURE: req für routing benutzen
});

dispatcher.onPost("/getClasses", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});

	authenticate(res,"getKlassen"); //FUTURE: req für routing benutzen
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
		"hostname": baseAdress,
		"port": null,
		"path": relativeAdressUnauthenticated,
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
			mergedRequests(ergebnis.result.sessionId, type, request);
		});
	});

	req.write("{\n    \"id\": \"ID\",\n    \"method\": \"authenticate\",\n    \"params\": {\n        \"user\": \"Benutzer\",\n        \"password\": \"Passwort\",\n        \"client\": \"Client\"\n        },\n    \"jsonrpc\": \"2.0\"\n}");
	req.end();
}

//Ruft mit sessionID an der WebUntis API die Operation type auf und gibt das Ergebnis an request zurück.
function mergedRequests(sessionID, type, request)
{
	var http = require("https");

	var options = {
		"method": "POST",
		"hostname": baseAdress,
		"port": null,
		"path": relativeAdressAuthenticated1 + sessionID + relativeAdressAuthenticated2,
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
			console.log(type+"; Length: " + body.toString().length)
			request.end(body.toString())
		});
	});

	req.write("{\"id\":\"ID\",\"method\":\""+type+"\",\"jsonrpc\":\"2.0\"}");
	req.end();
}


//Meldet den Server ab.
function logout(sessionId)
{
	var http = require("https");

	var options = {
		"method": "POST",
		"hostname": baseAdress,
		"port": null,
		"path": relativeAdressAuthenticated1 + sessionId + relativeAdressAuthenticated2,
		"headers": {
			"cache-control": "no-cache",
			"JSESSIONID": sessionId
		}
	};

	var req = http.request(options, function (res) {});

	req.write("{\"id\":\"ID\",\"method\":\"logout\",\"params\":{},\"jsonrpc\":\"2.0\"}");
	req.end();
}


