//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');

//Lets define a port we want to listen to
const PORT=8080;

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
	//Callback triggered when server is successfully listening. Hurray!
	console.log("Server listening on: http://localhost:%s", PORT);
});

//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStatic('./');

//A sample GET request
dispatcher.onGet("/page1", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Page One');
});

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	//res.end('Got Post Data');
	authenticate(res);
});

function authenticate(request)
{
	var http = require("https");

	var options = {
		"method": "POST",
		"hostname": "stundenplan.hamburg.de",
		"port": null,
		"path": "/WebUntis/jsonrpc.do?school=HH5888",
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "9e56bdf5-6015-ee05-700a-d6dcaf2abec4"
		}
	};

	var req = http.request(options, function (res) {
		var chunks = [];

		res.on("data", function (chunk) {
			chunks.push(chunk);
		});

		res.on("end", function () {
			var body = Buffer.concat(chunks);
			console.log(body.toString());
			request.end(body.toString());
		});
	});

	req.write("{\n    \"id\": \"ID\",\n    \"method\": \"authenticate\",\n    \"params\": {\n        \"user\": \"HWG\",\n        \"password\": \"WMS4\",\n        \"client\": \"Client\"\n        },\n    \"jsonrpc\": \"2.0\"\n}");
	req.end();
}
