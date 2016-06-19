var sessionID;

$(document).ready(function () {
	//Intialisierungen für MaterialzeCSS
	$('.modal-trigger').leanModal();
	$('select').material_select();
	$('ul.tabs').tabs();
	//Zeigt die Start Ansicht an
	getToDoList();
});

//Delegiert das Leeren der Tabelle und das Befüllen mit den Daten der Fächer von der WebUntis API.
function showSubjects() {
	makeRequest("getSubjects", "fächer");
}

//Delegiert das Leeren der Tabelle und das Befüllen mit den Daten der Klassen von der WebUntis API.
function showClasses() {
	makeRequest("getKlassen", "klassen");
}

//Macht ein Request an den nodeJS Server. Dieser fragt die Daten bei der WebUntis API ab und gibt sie wieder zurück. Das Leeren und Befüllen der Tabelle wird delegiert.
function makeRequest(requestTyp, typ) {
	clearTable();

	$.ajax(
		{
			type: "GET",
			url: "http://127.0.0.1:8080/" + requestTyp,
			headers: {
				"sessionid": sessionID
			}
		})
		.done(function (data) {
		fillTable(JSON.parse(data), typ);
	});
}

//Leert die Tabelle. D.h. dass Childnodes vom TableBody entfernt werden.
function clearTable() {
	var myNode = document.getElementById("tableID");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}

//Aktualisiert die Header der Tabelle. Die Befüllung wird weiter delegiert.
function fillTable(stundenListe, typ) {
	if (typ === "fächer") {
		setTableHeaders(["Fachname", "Fachabkürzung", "Ist Aktiv"]);
	} else if (typ === "klassen") {
		setTableHeaders(["Klassenname", "Klassenabkürzung", "Ist Aktiv"]);
	}

	clearTable();

	for (i = 0; i < stundenListe.result.length; i++) {
		addItem(stundenListe.result[i]);
	}
}

//Fügt ein Element der Tabelle hinzu.
function addItem(stunde) {
	var row = document.getElementById("tableID").insertRow(-1);
	row.setAttribute("id", stunde.id);

	if (stunde.backColor != null) {
		row.setAttribute("style", "background-color: #" + stunde.backColor.toString());
	}

	row.insertCell(0).innerHTML = stunde.longName;
	row.insertCell(1).innerHTML = stunde.name;
	row.insertCell(2).innerHTML = stunde.active;
}

//Setzt die Header der Tabelle.
function setTableHeaders(headers) {
	for (var i=0;i<headers.length;i++) {
		$('#name' + i).html(headers[i]);
	}
}

function addCurrentInputedToDoItem()
{
	var item = document.getElementById("todoItem")
	addToDoItem(item.value)
	document.getElementById("todoItemForm").reset()
}

function addToDoItem(item)
{
	if (item!="")
	{
		$.ajax({
			type: "PUT",
			url: "http://127.0.0.1:8080/todoList",
			headers: {
				"inhalt": item
			}
		})
			.done(function (data) {
			getToDoList()
		});
	}
}

function deleteToDoItem(item)
{
	document.getElementById(item).parentNode.removeChild(document.getElementById(item));

	$.ajax({
		type: "DELETE",
		url: "http://127.0.0.1:8080/todoList",
		headers: {
			"inhalt": item
		}
	})
		.done(function (data) {
		getToDoList()
	});
}

function getToDoList()
{
	$.ajax({
		type: "GET",
		url: "http://127.0.0.1:8080/todoList"
	})
		.done(function (data) {
		fillToDoList(JSON.parse(data));
	});
}

function fillToDoList(list)
{
	var node = document.getElementById("todoList");
	while(node.firstChild)
	{
		node.removeChild(node.firstChild)
	}

	for (item in list["items"])
	{
		var thisItem = list["items"][item]["inhalt"];
		var listItem = document.createElement("a");
		var item = document.createTextNode(thisItem);
		listItem.appendChild(item);
		listItem.setAttribute("href", 'javascript:deleteToDoItem("' + thisItem + '")')
		listItem.setAttribute("class", "collection-item")
		listItem.setAttribute("id", thisItem)
		var todoList = document.getElementById("todoList")
		todoList.appendChild(listItem)
	}
}


function login()
{
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8080/authenticate",
		headers: {
			"username": document.getElementById("username").value,
			"password": document.getElementById("password").value
		}
	})
		.done(function (data) {
		result = data.toString();
		if (result != "Invalid credentials")
		{
			console.log(result);
			$("#test1YouNeedToLogin").hide();
			$("#test1Table").show();
			sessionID = result;
			showSubjects();
		}
	});
}
