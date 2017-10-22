const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const session = require('express-session')
const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy;
var consolidate = require('consolidate');


passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new SpotifyStrategy({
	clientID: "2cff3e0c06b247098a8566c8c482bd72",
	clientSecret: "98d2b938cfd74e4181ce46233f629f8f",
	callbackURL: "http://localhost:3000/auth/spotify/callback"
},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function(){
			return done(null, profile);
		})
	}
));

const app = express()

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: 'Inspiring THacks, I guess' }));
app.use(passport.initialize());
app.use(passport.session());


app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs',
	layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (request, response) => {
	console.log(request.user);
	response.render('home', {
		user: request.user
	})
})

app.get('/search', isLoggedIn, (request, response) => {
	response.render('search_generic', {
		user: request.user
	})
})

app.get('/search/artist', isLoggedIn, (request, response) => {
	response.render('search_artist', {
		user: request.user
	});
})

app.get('/queue', isLoggedIn, (request, response) => {
	response.render('queue', {
		user: request.user
	});
})

app.get('/player', isLoggedIn, (request, response) => {
	response.render('player', {
		user: request.user
	});
})

app.get('/css/*', (request, response, next) => {
	response.sendFile(request.path, {root: __dirname})
})

app.get('/js/*', (request, response, next) => {
	response.sendFile(request.path, {root: __dirname})
})

app.get('/img/*', (request, response, next) => {
	response.sendFile(request.path, {root: __dirname})
})

app.get('/vendor/*', (request, response, next) => {
	response.sendFile(request.path, {root: __dirname})
})

app.get('/auth/spotify',
	passport.authenticate('spotify', {scope: [], showDialog: true }),
	function (req, res) {
		// The request will be redirected to spotify for authentication, so this
		// function will not be called.
	});

app.get('/auth/spotify/callback',
	passport.authenticate('spotify', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect home.
		console.log('Yes!');
		res.redirect('/');
	}
);

app.get('/logout', function(request, response){
	request.logout();
	response.redirect('/');
})


app.listen(3000);

function isLoggedIn(request, response, next){
	if(request.isAuthenticated()) { return next(); }
	console.log('Auth failed. Redirecting.');
	response.redirect('/login');
}

