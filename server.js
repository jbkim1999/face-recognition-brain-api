const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // a security feature (allow the front-end to access the data from back-end)
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

const app = express();

const db = knex({
	client: 'pg',
	connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'test'
  }
});

app.use(express.urlencoded({extended: false})); // needed to receive the request in form data
app.use(express.json()); // needed to receive the request in json
app.use(cors());

app.get('/', (req, res) => { res.send("back-end is working!")});

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }); // dependency injection

app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db('users').where('id', '=', id)
	// OR db.select('*').from('users').where({id}) // {id: id} simplified syntax
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json("not found");
			}
		})
		.catch(err => res.status(400).json('error getting user'));
});

const PORT = process.env.PORT; // environmental variable

app.listen(PORT || 3000, () => {
	console.log(`app is running on port ${PORT}`);
});