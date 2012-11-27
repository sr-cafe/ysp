module.exports = function(){
	//Common properties
	var obj = {

		facebook:{
			permissions: 'email',
			authCallbackURL: '/auth/facebook/callback'
		},

		routes:{
			user: {
				logged: '/you',
				notLogged:  '/notyou' //TODO Find a better name	
			}
		},

		views: {
			user: {
				logged: 'user/logged',
				notLogged: 'user/notLogged'
			}
		}
		

	};

	//Push environment properties into the object
	switch(process.env.NODE_ENV){
		case 'development':
			obj.facebook.credentials = {
				appId: '191047081020667',
				appSecret: 'd6c699c858340241ed702a2158789925'
			};
			break;
		case 'production':
			obj.facebook.credentials = {
				appId: '339964956101856',
				appSecret: '836f9b93fbecd59b8099cadb211bd9a8'
			}
			break;
	}

	return obj;
};