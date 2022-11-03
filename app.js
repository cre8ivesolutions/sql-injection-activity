const sqlite3 = require('sqlite3').verbose();
const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');

const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username postgres, password password, title sqlinjectionactivity)");
	db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

// Next, we need to create a GET method route to '/' that will send our HTML file to the browser (hint: res.sendFile('index.html')
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// We also need an Express POST route to '/login' that will handle any forms that are submitted via our HTML log-in form.
app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";

	console.log("username: " + username);
	console.log("password: " + password);
	console.log('query: ' + query);

	db.get(query, function (err, row) {

		if (err) {
			console.log('ERROR', err);
			res.redirect("/index.html#error");
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
		}
	});

});

// Our last step is to call app.listen(), passing in a port of our choosing
app.listen(3000);