const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jsonParser = bodyParser.json();

app.use(morgan('dev'));

// http://localhost:8080/api/bookmarks
// http://localhost:8080/api/bookmarksById?id=123

let bookmarksList = [
	{
		name: 'A',
		id: 123
	},
	{
		name: 'B',
		id: 456
	},
	{
		name: 'C',
		id: 789
	},
	{
		name: 'D',
		id: 719
	}
];

app.get('/api/bookmarks', (req, res) => {
	console.log('%c getting list of bookmarks', 'background: #332167; color: #B3D1F6; font-size: 16px');
	return res.status(200).json(bookmarksList);
});


app.get('/api/bookmarksById', (req, res) => {
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


	return res.status(200).json({
		result
	});
});

app.post('/api/addBookmark', (req, res) => {
	console.log('body', res.body);
	return res.status(200).json({});	
});

app.listen(8080, () => {
	console.log('this server is running in port 8080.');
});
