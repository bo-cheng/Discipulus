$(document).ready(function(){
	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal-trigger').leanModal();
	$('select').material_select();
	zeigeFächerAn();
});

function zeigeFächerAn()
{
	macheRequestUndFülleTabelle("authenticate", "fächer")
}

function macheRequestUndFülleTabelle(requestTyp, typ)
{
	clearTable()

	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8081/" + requestTyp,
		data: ''
	})
		.done(function (data) {
		fillTable(JSON.parse(data), typ)
	});
}

function clearTable()
{
	var myNode = document.getElementById("tableID");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}

function zeigeKlassenAn()
{
	macheRequestUndFülleTabelle("getClasses", "klassen")
}

function fillTable(stundenListe, typ)
{
	if(typ=="fächer")
		{
			setTableHeaders("Fachname", "Fachabkürzung", "Ist Aktiv");
		}
	else if (typ = "klassen")
		{
			setTableHeaders("Klassenname", "Klassenabkürzung", "Ist Aktiv");
		}

	werteZuTabelleHinzufügen(stundenListe)
}

function werteZuTabelleHinzufügen(werte)
{
	var werteListe = werte.result
	for (i = 0; i < werteListe.length; i++)
	{
		fügeZuTabelleHinzu(werteListe[i])
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

	var row1 = row.insertCell(0);
	var row2 = row.insertCell(1);
	var row3 = row.insertCell(2);

	row1.innerHTML = stunde.longName
	row2.innerHTML = stunde.name
	row3.innerHTML = stunde.active
}

function setTableHeaders(header1, header2, header3)
{
	document.getElementById("name1").innerHTML=header1
	document.getElementById("name2").innerHTML=header2
	document.getElementById("name3").innerHTML=header3
}
