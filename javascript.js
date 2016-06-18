$(document).ready(function() {
    //Intialisierungen für MaterialzeCSS
    $('.modal-trigger').leanModal();
    $('select').material_select();
    $('ul.tabs').tabs();
    //Zeigt die Start Ansicht an
    showSubjects();
	getToDoList();
});

//Delegiert das Leeren der Tabelle und das Befüllen mit den Daten der Fächer von der WebUntis API.
function showSubjects() {
    makeRequest("getSubjects", "fächer")
}

//Delegiert das Leeren der Tabelle und das Befüllen mit den Daten der Klassen von der WebUntis API.
function showClasses() {
    makeRequest("getClasses", "klassen")
}

//Macht ein Request an einen nodeJS Server. Dieser fragt die Daten bei der WebUntis API ab und gibt sie wieder zurück. Das Leeren und Befüllen der Tabelle wird delegiert.
function makeRequest(requestTyp, typ) {
    clearTable()

    $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080/" + requestTyp,
            data: ''
        })
        .done(function(data) {
            fillTable(JSON.parse(data), typ)
        });
}

//Leert die Tabelle. D.h. dass Childnodes vom TableBody entfernt werden.
function clearTable() {
	var myNode = document.getElementById("tableID")
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

//Aktualisiert die Header der Tabelle. Die Befüllung wird weiter delegiert.
function fillTable(stundenListe, typ) {
    if (typ == "fächer") {
        setTableHeaders(["Fachname", "Fachabkürzung", "Ist Aktiv"]);
    } else if (typ == "klassen") {
        setTableHeaders(["Klassenname", "Klassenabkürzung", "Ist Aktiv"]);
    }

	clearTable();

    for (i = 0; i < stundenListe.result.length; i++) {
        addItem(stundenListe.result[i])
    }
}

//Fügt ein Element der Tabelle hinzu.
function addItem(stunde) {
    var tabelle = document.getElementById("tableID")

    var row = tabelle.insertRow(-1);
    row.setAttribute("id", stunde.id)

    if (stunde.backColor != null) {
        row.setAttribute("style", "background-color: #" + stunde.backColor.toString())
    }

    var row1 = row.insertCell(0);
    var row2 = row.insertCell(1);
    var row3 = row.insertCell(2);

    row1.innerHTML = stunde.longName
    row2.innerHTML = stunde.name
    row3.innerHTML = stunde.active
}

//Setzt die Header der Tabelle.
function setTableHeaders(headers) {
    for(var i=0;i<headers.length;i++) {
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
