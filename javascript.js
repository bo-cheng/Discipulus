$(document).ready(function(){
	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal-trigger').leanModal();
	$('select').material_select();
	authenticate();
});

function authenticate()
{
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8080/post1",
		data: ''
	})
	.done(function (data) {
		console.log(data)
	});
}
