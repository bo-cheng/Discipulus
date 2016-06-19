var fileSystem = require("fs");

const databasePath = "./datenbank.json";

var writeToDatabase = function(inhalt) {
	var inJSON = JSON.parse(fileSystem.readFileSync(databasePath));
	inJSON["items"].push({"inhalt": inhalt});
	fileSystem.writeFileSync(databasePath, JSON.stringify(inJSON));
}

var deleteFromDatabase = function(inhalt) {
	var inJSON = JSON.parse(fileSystem.readFileSync(databasePath));
	for (i=0; i < inJSON["items"].length; i++)
	{
		// FIXME Somewhat buggy semes to leave out the last one if there are two or more
		if (inJSON["items"][i]["inhalt"] == inhalt)
		{
			inJSON["items"].splice(i,1)
		}
	}
	fileSystem.writeFileSync(databasePath, JSON.stringify(inJSON));
}

var getList = function() {
	var inJSON = JSON.parse(fileSystem.readFileSync(databasePath));
	return JSON.stringify(inJSON);
}

exports.getList = getList;
exports.writeToDatabase = writeToDatabase;
exports.deleteFromDatabase = deleteFromDatabase;
