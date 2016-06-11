//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');

//Lets define a port we want to listen to
const PORT=8080;


var ergebnis;
//We need a function which handles requests and send response
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

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
	console.log("Server listening on: http://localhost:%s", PORT);
});

//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStatic('./');

//A sample POST request
dispatcher.onPost("/getSubjects", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});
	//res.end('Got Post Data');
	authenticate(res,"subjects"); //TODO: req für routing benutzen
});

dispatcher.onPost("/getClasses", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": "*"});

	authenticate(res,"classes"); //TODO: req für routing benutzen
})

function authenticate(request, type)
{
	if(ergebnis!=null)
		{
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
			routing(ergebnis, ergebnis.result.sessionId, type, request);
		});
	});

	req.write("{\n    \"id\": \"ID\",\n    \"method\": \"authenticate\",\n    \"params\": {\n        \"user\": \"HWG\",\n        \"password\": \"WMS4\",\n        \"client\": \"Client\"\n        },\n    \"jsonrpc\": \"2.0\"\n}");
	req.end();
}

function routing(result, sessionId, type, request) {
	if (type == "subjects")
	{
		getSubjects(ergebnis.result.sessionId, request)
	}
	else if (type == "classes")
	{
		getClasses(ergebnis.result.sessionId, request)
	}
}

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
