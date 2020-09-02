const Clarifai = require('clarifai'); // moved the image scanning to back-end for security issues

const app = new Clarifai.App({
	apiKey: '3cef5a94d13c4154b832c103a90da8ec'
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input) // communicate to Clarifai API (in back-end)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with api'));
};

const handleImage = (req, res, db) => {
	const { id } = req.body;
	
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('unable to get count'));
};

module.exports = {
	handleImage,
	handleApiCall
};