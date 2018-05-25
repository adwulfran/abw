var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/clients");


var clientSchema = mongoose.Schema({
	motdepasse : String,
	nom : String,
	prenom : String,
	adresse : String,
	email : String,
	numerocarte : String,
	nombenef : String,
	asso : String,
	danslarue : String
})
var Client = mongoose.model("Client", clientSchema);




	Client.findOneAndRemove({nombenef : 'Fourfou'} , function(err, client) {					
		console.log("nbre de torent supprime:" + client);})


