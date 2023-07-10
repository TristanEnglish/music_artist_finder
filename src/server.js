/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);


// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



app.get('/', function(req, res) {
  res.render('pages/main', {
    my_title: "Home Page",
    items: '',
    error: false,
    message: ''
  });
});

app.get('/main', function(req, res) {
    res.render('pages/main', {
      my_title: "Home Page",
      items: '',
      error: false,
      message: ''
    });
  });
  
app.get('/searches', function(req, res) {
	var query = 'select * from search_results;';
	db.any(query)
		.then(function (info) {
			res.render('pages/searches',{
        my_title: "Search History",
        items: info,
        error: false,
        message: ''
			})

		})
		.catch(function (err) {
			res.render('pages/searches', {
        my_title: "Search History",
        items: '',
        error: true,
        message: ''
			})
		})
});

app.post('/main', function(req, res) {
  var name = req.body.artist_name;
  name = name.replace(/'/g,"`")
  var img  = req.body.artist_img;
  img = img.replace(/'/g,"`")
  var genre  = req.body.artist_genre;
  genre = genre.replace(/'/g,"`")
  var country  = req.body.artist_country;
  country = country.replace(/'/g,"`")
  var biography  = req.body.artist_biography;
  biography = biography.replace(/'/g,"`")

  const info = {
    artist_name: name,
    artist_img: img,
    artist_genre: genre,
    artist_country: country,
    artist_biography: biography
  };
  
  console.log("post called");
  var insert_statement = `INSERT INTO search_results(artist_name, artist_img, artist_genre, artist_country, artist_biography) VALUES('${name}','${img}','${genre}','${country}','${biography}');`;
	db.any(insert_statement)
		.then(function (data) {
      res.status(200).send(info)
		})
		.catch(function (err) {
      console.log("error inserting");
      res.status(404).send(err)
		})
});



//app.listen(3000);
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

module.exports = server
