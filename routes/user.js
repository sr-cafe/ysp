var Config = require('../config'),
	config = new Config(),
	userViews = config.views.user; //Shortcut

//User logged
exports.logged = function(req, res){
	res.render(userViews.logged,
		{
			title: 'OKs!!!',
			locals:{
				user: req.user
			}
		
		}
	);
};

//User not logged
exports.notLogged = function(req, res){
	res.render(userViews.notLogged,
		{
			title: 'KO'
		}
	);
};