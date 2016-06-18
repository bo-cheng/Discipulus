var fileSystem = require("fs");

var writeToDatabase = function(inhalt) {
	var inJSON = JSON.parse(fileSystem.readFileSync("./discipulus/datenbank.json"));
	console.log(inJSON);
	inJSON["items"].push({"inhalt": inhalt});
	console.log(inJSON);
	fileSystem.writeFileSync("./discipulus/datenbank.json", JSON.stringify(inJSON));

}

var deleteFromDatabase = function(inhalt) {
	var inJSON = JSON.parse(fileSystem.readFileSync("./discipulus/datenbank.json"));
	console.log(inJSON)
	for (i=0; i < inJSON["items"].length; i++)
	{
		if (inJSON["items"][i]["inhalt"] == inhalt)
		{
			inJSON["items"].splice(i,1)
		}
	}
	console.log(inJSON)
	fileSystem.writeFileSync("./discipulus/datenbank.json", JSON.stringify(inJSON));
}

var getList = function() {
	var inJSON = JSON.parse(fileSystem.readFileSync("./discipulus/datenbank.json"));
	return JSON.stringify(inJSON);
}

exports.getList = getList;
exports.writeToDatabase = writeToDatabase;
exports.deleteFromDatabase = deleteFromDatabase;
