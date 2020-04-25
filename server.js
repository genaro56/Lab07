const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const jsonParser = bodyParser.json();

/* middleware */
const validateToken = require('./middleware/validateToken');
const validatePatch = require('./middleware/validatePatch');


app.use(morgan('dev'));
app.use(validateToken);

/**
 * id: uuid.v4(),
	title: string,
	description: string,
	url: string,
	rating: number
 */
let bookmarksList = [
	{
		id: 123,
		title: 'Pride and Prejudice wiki',
		description: 'lorem ipsum dolor sur amat',
		url: 'https://en.wikipedia.org/wiki/Pride_and_Prejudice',
		rating: 5,
	},
	{
		id: 456,
		title: 'Pride and Prejudice wiki',
		description: 'lorem ipsum dolor sur amat',
		url: 'https://en.wikipedia.org/wiki/Pride_and_Prejudice',
		rating: 5,
	},
	{
		id: 789,
		title: 'higher-order-functions',
		description: 'haskelll hof tutorial',
		url: 'http://learnyouahaskell.com/higher-order-functions',
		rating: 10,
	}
];

app.get('/api/bookmarks', validateToken, (req, res) => {
	console.log('%c getting list of bookmarks', 'background: #332167; color: #B3D1F6; font-size: 16px');
	console.log(req.headers);
	return res.status(200).json(bookmarksList);
});


app.get('/api/bookmark', validateToken, (req, res) => {
	console.log('Getting boomark by title');
	console.log(req.query.title);
	let queryTitle = req.query.title;
	if (!queryTitle) {
		res.statusMessage = 'The param title is required.';
		return res.status(406).end();
	};
	let result = bookmarksList.filter((bookmark) => bookmark.title == queryTitle);
	if (result.length < 1) {
		res.statusMessage = `The title ${queryTitle} does not exist`;
		return res.status(404).end();
	}
	return res.status(200).json(result);
});

app.post('/api/bookmarks', [jsonParser, validateToken], (req, res) => {
	console.log('Adding a bookmark');
	console.log('body', req.body);
	const { title, description, url, rating } = req.body;
	if (!title ||
		!description ||
		!rating ||
		!url
	) {
		res.statusMessage = "One of the parameters is missing";
		return res.status(406).end();
	}
	if (typeof (rating) !== "number") {
		res.statusMessage = "The rating must be a number";
		return res.status(406).end();
	}

	let newBookmark = {
		id: uuid.v4(),
		title,
		description,
		url,
		rating
	}
	bookmarksList.push(newBookmark);
	return res.status(201).json({ bookmark: newBookmark });
});

app.patch('/api/bookmark/:id', [jsonParser, validatePatch, validateToken], (req, res) => {
	let id = req.params.id;
	const {title, description, url, rating} = req.body;

	if (Object.keys(req.body).length < 2) {
		res.statusMessage = "Please provide at least one parameter and an id to update the object";
		return res.status(406).end();
	} else if (rating && typeof (rating) !== "number") {
		res.statusMessage = "The rating must be a number";
		return res.status(406).end();
	}
	let bookmarkIndex = bookmarksList.findIndex(bookmark => {
		if (bookmark.id == id) {
			return true;
		}
	});
	if (bookmarkIndex < 0) {
		res.statusMessage = "The id sent does not exist in the bookmarks-api.";
		return res.status(406).end();
	} else {
		const _bookmarkToUpdate = {
			...bookmarksList[bookmarkIndex],
			...req.body,
		};
		console.log('updated:', _bookmarkToUpdate);
		bookmarksList[bookmarkIndex] = { ..._bookmarkToUpdate, id: bookmarksList[bookmarkIndex].id  };
	}
	console.log('bookmark updated:', bookmarksList[bookmarkIndex]);

	return res.status(202).json({ bookmark: bookmarksList[bookmarkIndex] });
})

app.delete('/api/bookmark/:id', validateToken, (req, res) => {
	let id = req.params.id;
	console.log(id)
	if (!id) {
		res.statusMessage = "The id must be sent as a parameter"
		res.status(406).end();
	}

	let index = bookmarksList.findIndex(bookmark => {
		if (bookmark.id == id) {
			return true;
		}
	});

	if (index < 0) {
		res.statusMessage = "The id sent was not found in the existing bookmarks.";
		return res.status(400).end();
	} else {
		bookmarksList.splice(index, 1);
		console.log(index);
	}
	return res.status(204).end();
})

app.listen(8080, () => {
	console.log('this server is running in port 8080.');
});
