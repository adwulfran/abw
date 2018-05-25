var http = require('http');
var mongoose = require('mongoose');
var parseurl = require('parseurl')
var session = require('express-session');
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = require('express')();
app.set('trust proxy', 1); // trust first proxy
var util = require('util');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var Keygrip = require('keygrip');
var app = require('express')()
// cookie essaie //
app.use( require('request-param')() )
var createHash = require('hash-generator');var hashLength = 8;var hash = createHash(8);
app.use(session({
	secret: hash,
	resave: false,
	saveUninitialized: true,
	cookie : { maxAge : 60000*3 }
}))
var bodyParser = require('body-parser')
var server = require('http').Server(app);
var io = require('socket.io')(server);
/* premier message : c'est pour la branche experimental  */
server.listen(8181); /* OU app.set('port', process.env.PORT || 8181); */

mongoose.connect("mongodb://localhost/clients");


var clientSchema = mongoose.Schema({
	motdepasse : String,
	nom : String,
	prenom : String,
	prenombenef : String,
	adresse : String,
	email : String,
	numerocarte : String,
	nombenef : String,
	asso : String,
	danslarue : String,
	mystory : String
})
var Client = mongoose.model("Client", clientSchema);

// Create the server 

// all environments
/* app.set('port', process.env.PORT || 8181); */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'forms')));


//development only

app.use(function (req, res, next) {
	if (!req.session.urltk) {
		req.session.urltk = [];
	}

	if (!req.session.urltk2) {
		req.session.urltk2 = [];
	}

	if (!req.session.urltk3) {
		req.session.urltk3 = [];
	}

	if (!req.session.urltk4) {
		req.session.urltk4 = [];
	}

	var pathname = parseurl(req).pathname;

	next()
})


app.use(cookieParser())


app.get("/abetterworld", function(req, res) { 
	res.render("abetterworld.ejs");
})

app.get("/abetterworld/donateur", function(req, res) { 
	res.render("abwdonateur.ejs");
})

app.get("/abetterworld/beneficiaire", function(req, res) { 
	res.render("abwbenef.ejs");
})

app.get("/abetterworld/donateur/profil/:id?", function(req, res) { 
	var id = req.params.id; 
	var email = req.param("email"); req.session.urltk.push(email);
	var motdepasse = req.param("motdepasse"); req.session.urltk2.push(motdepasse);
	console.log(req.session.urltk[0]); console.log(req.session.urltk2[0]);
	res.redirect("/abetterworld/donateur/informations/");			
})


// PARTIE BENEFICIAIRE PAS TERMINE
app.get("/abetterworld/beneficiaire/profil/:id?", function(req, res) { 
	var id = req.params.id; 
	var nom = req.param("nom");// fs.writeFileSync("nom.txt", nom);// remplacer writeFileSync par req.session
	var nom = req.session.urltk3.push(nom); 
	var prenom = req.param("prenom"); //fs.writeFileSync("prenom.txt", prenom);// idem
	var prenom = req.session.urltk4.push(prenom);
	res.redirect("/abetterworld/beneficiaire/informations/");			
})

app.get("/abetterworld/donateur/informations/", function(req, res) { 

	res.render("abwinformations.ejs");
})

app.get("/abetterworld/beneficiaire/informations/", function(req, res) { 

	res.render("abwbenefinformations.ejs");
})

app.get("/abetterworld/donateur/informations/update/:id?", function(req, res) { 
	var id = req.params.id;
	var motdepasse = req.session.urltk2[0]; var email = req.session.urltk[0];
	var nom = req.param("nom"); 
	var prenom = req.param("prenom");
	var adresse = req.param("adresse"); console.log(email);
	Client.create({email : email , motdepasse : motdepasse, nom: nom, prenom: prenom, adresse : adresse}, function(err, client) { 
		res.redirect("/abw/carte/");
		console.log(client)
	})	
})

app.get("/abetterworld/beneficiaire/informations/update/:id?", function(req, res) { 
	var id = req.params.id;
	//var nom = fs.readFileSync("nom.txt").toString(); var prenom = fs.readFileSync("prenom.txt").toString();
	var nom = req.session.urltk3[0]; var prenom = req.session.urltk4[0];
	var motdepasse = req.param("motdepasse");
	var asso = req.param("asso");
	var danslarue = req.param("itss");
	Client.create({nombenef : nom , motdepasse : motdepasse, prenombenef : prenom, asso : asso, danslarue : danslarue }, function(err, client) { 
		res.redirect("/abw/mystory/");
		console.log(client)
	})	
})


app.get("/abw/carte/", function(req, res) { 

	res.render("abwcarte.ejs");

})

app.get("/abw/mystory/", function(req, res) { 

	res.render("abwmystory.ejs");

})


app.get("/abw/carte/update/:id?", function(req, res) { 

	var numerocarte = req.param("numerocarte");
var email = req.session.urltk[0];	
Client.update({ email : email}, { numerocarte : numerocarte }, { multi : true },function(err, numberAffected) { 
	Client.find({email : email}, function(err, clients) { 

		console.log(clients);
		res.redirect("/clients/voirprofil/");

	});
});
});


app.get("/abw/mystory/update/:id?", function(req, res) { 

	var mystory = req.param("mystory");
var nom = req.session.urltk3[0];	
Client.update({ nombenef : nom}, {  mystory : mystory }, { multi : true },function(err, numberAffected) { 
	Client.find({nombenef : nom}, function(err, clients) { 

		console.log(clients);
		res.render("showbenef.ejs", { clients : clients });

	});
});
});
app.get("/clients/voirprofil/", function(req, res) { 
	var email = req.session.urltk[0];
	var motdepasse = req.session.urltk2[0];
	Client.find({$and : [ { email  : email } , { motdepasse : motdepasse} ]}, function(err, clients) { 
		res.render("show.ejs", { clients : clients });
	})		
})


app.get("/faireundon", function(req, res) { 

	res.render("abwdon.ejs");

})

app.get("/faireundon2", function(req, res) { 

	res.render("abwdon2.ejs");

})

app.get("/search", function(req, res) { 

	res.render("abwdon.ejs");

})


app.get("/clients/login/", function(req, res) { 	
	res.render("login.ejs");					
})

app.get("/accueil2/:id?", function(req, res) {
	var id = req.params.id; console.log(req.query.emaill)
	var email = req.param("emaill"); console.log(email);
	var motdepasse = req.param("motdepasse");console.log(motdepasse)
	
	/* ACCES VALIDE */
	Client.find().count({$and : [ { email  : email } , { motdepasse : motdepasse} ]}, function(err, count) { 	
		if ( count != 0) {
			Client.find({$and : [ { email  : email } , { motdepasse : motdepasse} ]}, function(err, clients) {
				res.render("show.ejs", { clients : clients });
			})	
		}
		else { 
			res.redirect("/incorrectlogin");
		}
	})

})

/* login incorrect */
app.get("/incorrectlogin", function(req, res) { 
	res.render("incorrectlogin.ejs");
})

app.get("/abw/profil/:id?", function(req, res) { 
	Client.find(function(err, clients) { 	
		console.log(clients);
		res.render("abwprofil.ejs", { clients : clients});
	})
})

/* boutton DON trouver beneficiaire */
app.get("/clients/voirbeneficiaire/:id?", function(req, res) { 
	var prenombeneff = req.param("prenombeneff");
	Client.find().count({prenombenef : prenombeneff}, function(err, count) { 
		Client.find({prenombenef : prenombeneff}, function(err, clients) { 
			if ( count != 0 ) { 
				res.render("showbenef.ejs", { clients : clients });
			}

			else { res.render ("incorrectbeneficiaire") }
		})	
	})	
})


app.get("/clients/voir/:id?", function(req, res) { 
	var id = req.params.id;
	var naame = req.param("nom");
	Client.findById(id, function(err, client) { 
		res.render("show.ejs", { client : client });
	})

})

app.get("/clients/img/img_avatar.png", function(req, res) {
	
	res.sendfile('views/img/img_avatar.png');	
});

app.get("/clients/img/qrcode.png", function(req, res) {
	
	res.sendfile('views/img/qrcode.png');	
});


app.get("/abw/css", function(req, res) {
	

	res.sendFile(path.join(__dirname+'/views/css/style.css'));

})


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

