$(document).ready(function(){
	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal-trigger').leanModal();
	$('select').material_select();
	authenticate();
});

function authenticate()
{
	var serverStamm = "https://stundenplan.hamburg.de/WebUntis/jsonrpc.do?school="
	var schuleEndung = ""
	var server = serverStamm + schuleEndung

	$.ajax({
		type: "POST",
		url: server,
		data: {
			"id": "1",
			"method": "authenticate",
			"params": {
				"user": document.getElementById("username").textContent,
				"password": document.getElementById("password").textContent
			},
			"jsonrpc": "2.0"
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		},
	})
	.done(function (data) {
		console.log(data)
	});
}
