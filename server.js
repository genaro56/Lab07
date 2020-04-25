const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jsonParser = bodyParser.json();
const validateToken = require('./middleware/validateToken');
const uuid = require('uuid');
app.use(morgan('dev'));
app.use(validateToken);

// http://localhost:8080/api/bookmarks
// http://localhost:8080/api/bookmarksById?id=123


/**
 * id: uuid.v4(),
	title: string,
	description: string,
	url: string,
	rating: number
 */
let bookmarksList = [
	{
		id: uuid.v4(),
		title: 'Pride and Prejudice wiki',
		description: 'lorem ipsum dolor sur amat',
		url: 'https://en.wikipedia.org/wiki/Pride_and_Prejudice',
		rating: 5,
	},
	{
		id: uuid.v4(),
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


app.get('/api/bookmarksById', validateToken, (req, res) => {
	console.log('Getting boomark by id');
	console.log(req.query.id);
	let queryId = req.query.id;
	if(!queryId) {
		res.statusMessage = 'The param id is required.';
		return res.status(406).end();
	};
	let result = bookmarksList.find((bookmark) => { 
		if (bookmark.id  == queryId) return bookmark;
	});

	if (!result){ 	
		res.statusMessage = `No bookmark with the id ${queryId} found`;
		return res.status(400).end();
	}
	return res.status(200).json({ result });
});

app.post('/api/addBookmark', [jsonParser, validateToken], (req, res) => {
	console.log('Adding a bookmark');
	console.log('body', req.body);
	let name = req.body.name;
	let id = req.body.id;
	if(!name || !id) {   
		res.statusMessage = "Both id and name are required"
		return res.status(406).end();
	}
	if(typeof(id) !== "number") {
		res.statusMessage = "The id must be a number";
		return res.status(406).end();
	}
	let flag = true;
	for (let index = 0; index < bookmarksList.length; index++) {
		if (bookmarksList[index].id === id) {
			flag = !flag;
			break;
		}
	}
	if(!flag) {
		res.statusMessage = `The id: ${id} sent is already being used.`
		return res.status(406).end();  
	} else {
		let newBookmark = {
			name,
			id,
		}
		bookmarksList.push(newBookmark);
		return res.status(201).json({ newBookmark });
	}
});

app.delete('/api/deleteBookmark', validateToken, (req, res) => {
	console.log('body', req.body);
	let id = req.query.id;

	if(!id) {
		res.statusMessage = "The id must be sent as a parameter"
		res.status(406).end();
	}
	
	let index = bookmarksList.findIndex(bookmark => {
		if(bookmark.id === Number(id)) {
			return true;
		}
	});

	if(index < 0) {
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
