const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt); //using bcrypt synch methods
	
	if(!email | !name | !password) {
		return res.status(400).json('incorrect form submission');
	} // validation from back-end
	
	db.transaction(trx => { // create a transaction when you do two or more things at once
		trx.insert({
			hash: hash,
			email: email
		})
			.into('login') // a way of inserting
			.returning('email') // reference by column name
			.then(loginEmail => { // moved the users TABLE insert block inside the transaction
				return trx('users') // trx used instead of db, include return statement
					.returning('*') // insert new user and return * from users TABLE
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.then(user => res.json(user.slice(-1)[0]));  // access * later
			})
			.then(trx.commit) // if everything passes good to go
			.catch(trx.rollback); // otherwise roll back to original (trx syntax)
	})
		.catch(err => res.status(400).json(err));
}

module.exports = {
	handleRegister: handleRegister
};