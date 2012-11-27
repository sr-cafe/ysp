
/**
* Module dependencies.
*/

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , stylus = require('stylus')
    , passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy
    , Config = require('./config')
    , assetManager = require('connect-assetmanager');

var app = express(),
    config = new Config(),
    //Config shortcuts
    facebookConfig = config.facebook,
    routesConfig = config.routes,
    
    users = []; //TODO Delete after DDBB integration

/*
    FACEBOOK INTEGRATION
*/
passport.use(new FacebookStrategy(
    {
        clientID: facebookConfig.credentials.appId,
        clientSecret: facebookConfig.credentials.appSecret,
        callbackURL: facebookConfig.authCallbackURL
    },
    function(token, secretToken, profile, done){
        var user = users[profile.id] || (users[profile.id] = profile._json);
        done(null, user);
    })
);

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    var user = users[id];
    done(null, user);
});
/* End FACEBOOK INTEGRATION */

/*
    MIDDLEWARE
*/
//Asset middleware to compile all JS files
//in just one.
//Just JS. Express takes care of stylus to css management.
var assetManagerGroups = {
    'js': {
        'route': /javascripts\/script.js/, //Path to final file
        'path': __dirname + '/client_src/javascript/', //Source folder
        'dataType': 'javascript',
        'files': [
            'jquery-1.8.3.js',
            'app.js'
        ]
    }
};
var assetsManagerMiddleware = assetManager(assetManagerGroups);
/* End MIDDLEWARE */


/*
    CONFIGURATION
*/
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('Because of the wonderful things he does'));
    app.use(express.session(
        {
            secret: 'Everything you know you\'ll never knew', 
        }
    ));
    app.use(passport.initialize());//Always init Passport after Express session.
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
    //Only use JIT compilation on development mode
    app.use(require('stylus').middleware(
        {
            src: __dirname + '/client_src',
            dest: __dirname + '/public'
        }
    ));
    app.use(assetsManagerMiddleware);    
});
/* End CONFIGURATION */


/*
    ROUTING
*/
app.get('/', routes.index);
app.get(routesConfig.user.logged, user.logged); //Home page for logged users
app.get(routesConfig.user.notLogged, user.notLogged); //Page for users not on the BBDD
app.get('/auth/facebook', passport.authenticate(
    'facebook', 
    {
        scope: facebookConfig.permissions
    }
));
app.get(config.facebook.authCallbackURL, passport.authenticate(
    'facebook', 
    {
        successRedirect: routesConfig.user.logged,
        failureRedirect: routesConfig.user.notLogged
    }
));
/* End ROUTING */




http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
