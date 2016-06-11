var stunden;

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
		url: "http://127.0.0.1:8080/authenticate",
		data: ''
	})
		.done(function (data) {
		stunden = JSON.parse(data)
		fillTable()
	});
}

function fillTable()
{
	var stundenList = stunden.result
	console.log(stunden.result)
	for (i = 0; i < stunden.result.length; i++)
	{
		fügeZuTabelleHinzu(stundenList[i])
	}
}

function fügeZuTabelleHinzu(stunde)
{
	var tabelle = document.getElementById("tableID");

	var row = tabelle.insertRow(-1);
	row.setAttribute("id", stunde.id)


	if(stunde.backColor != null)
		{
			row.setAttribute("style", "background-color: #" + stunde.backColor.toString())
			console.log("Hintergrundfarbe " + stunde.backColor + " gesetzt.")
		}

	var fachname = row.insertCell(0);
	var fachabkürzung = row.insertCell(1);
	var istAktiv = row.insertCell(2);

	fachname.innerHTML = stunde.longName
	fachabkürzung.innerHTML = stunde.name
	istAktiv.innerHTML = stunde.active
}
