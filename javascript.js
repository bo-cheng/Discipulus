$(document).ready(function() {
    //Intialisierungen für MaterialzeCSS
    $('.modal-trigger').leanModal();
    $('select').material_select();
    $('ul.tabs').tabs();
    //Zeigt die Start Ansicht an
    zeigeFächerAn();
});

//Delegiert das Leeren der Tabelle und das Befüllen mit den Daten der Fächer von der WebUntis API.
function zeigeFächerAn() {
    macheRequestUndFülleTabelle("getSubjects", "fächer")
}

//Delegiert das Leeren der Tabelle und das Befüllen mit den Daten der Klassen von der WebUntis API.
function zeigeKlassenAn() {
    macheRequestUndFülleTabelle("getClasses", "klassen")
}

//Macht ein Request an einen nodeJS Server. Dieser fragt die Daten bei der WebUntis API ab und gibt sie wieder zurück. Das Leeren und Befüllen der Tabelle wird delegiert.
function macheRequestUndFülleTabelle(requestTyp, typ) {
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
    var myNode = document.getElementById("tableID");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

//Aktualisiert die Header der Tabelle. Die Befüllung wird weiter delegiert.
function fillTable(stundenListe, typ) {
    if (typ == "fächer") {
        setTableHeaders("Fachname", "Fachabkürzung", "Ist Aktiv");
    } else if (typ = "klassen") {
        setTableHeaders("Klassenname", "Klassenabkürzung", "Ist Aktiv");
    }

    werteZuTabelleHinzufügen(stundenListe)
}

//Iteriert über die einzelnen Einträge der Wertelist. Das konkrete hinzufügen wird delegiert.
function werteZuTabelleHinzufügen(werte) {
    var werteListe = werte.result
    for (i = 0; i < werteListe.length; i++) {
        fügeZuTabelleHinzu(werteListe[i])
    }
}

//Fügt ein Element der Tabelle hinzu.
function fügeZuTabelleHinzu(stunde) {
    var tabelle = document.getElementById("tableID");

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
function setTableHeaders(header1, header2, header3) {
    document.getElementById("name1").innerHTML = header1
    document.getElementById("name2").innerHTML = header2
    document.getElementById("name3").innerHTML = header3
}
