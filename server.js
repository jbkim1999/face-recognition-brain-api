const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			password: "john123",
			email: 'john@email.com',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			password: 'sally123',
			email: 'sally@email.com',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'hi@email.com'
		}
	]
}

app.get('/', (req, res) => {
	return res.json(database.users);
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(400).json("not found");
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(400).json('not found');
	}
})

app.post('/signin', (req, res) => {
	// 	// Load hash from your password DB.
	// bcrypt.compare("B4c0/\/", hash, function(err, res) {
	// 	// res === true
	// });
	// bcrypt.compare("not_bacon", hash, function(err, res) {
	// 	// res === false
	// });
	if (req.body.email === database.users[0].email &&
	   req.body.password == database.users[0].password) {
		res.json(database.users[0]);;
	} else {
		res.status(400).json("error logging in")
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	// bcrypt.hash(password, 8, function(err, hash) {
	// 	console.log(hash);
	// });
	database.users.push({
		id: '125',
		name: name,
		email: email,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.listen(3000, () => {
	console.log('app is running on port 3000');
})