exports.list = function(req, res) { 
	var id = req.params.id; 
	var email = req.param("email"); req.session.urltk.push(email);
	var motdepasse = req.param("motdepasse"); req.session.urltk2.push(motdepasse);
	console.log(req.session.urltk[0]); console.log(req.session.urltk2[0]);
	res.redirect("/abetterworld/donateur/informations/");			
}