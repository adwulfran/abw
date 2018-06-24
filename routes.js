var donateur = require("./routes/donateur");
var donateurprofil = require("./routes/donateurprofil")

module.exports = function(app) {
	app.get("/abetterworld/donateur", donateur.list);
	app.get("/abetterworld/donateur/profil/:id?", donateurprofil.list);
}