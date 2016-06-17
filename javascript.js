$(document).ready(function() {
    //Intialisierungen für MaterialzeCSS
    $('.modal-trigger').leanModal();
    $('select').material_select();
    $('ul.tabs').tabs();
    //Zeigt die Start Ansicht an
    showSubjects();
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
    var myNode = $('#tableID');
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

//Aktualisiert die Header der Tabelle. Die Befüllung wird weiter delegiert.
function fillTable(stundenListe, typ) {
    if (typ == "fächer") {
        setTableHeaders(["Fachname", "Fachabkürzung", "Ist Aktiv"]);
    } else if (typ = "klassen") {
        setTableHeaders(["Klassenname", "Klassenabkürzung", "Ist Aktiv"]);
    }

    for (i = 0; i < stundenListe.result.length; i++) {
        additem(werteListe[i])
    }
}

//Fügt ein Element der Tabelle hinzu.
function addItem(stunde) {
    var tabelle = $('#tableID');

    var row = tabelle.insertRow(-1);
    row.setAttribute("id", stunde.id)


    if (stunde.backColor != null) {
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

//Setzt die Header der Tabelle.
function setTableHeaders(headers) {
    for(var i=0;i<headers.length;i++) {
        $('name' + i).html(headers[i]);
    }
}
