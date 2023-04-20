require('dotenv').config();
const express = require('express');
const app = express();
const authorize = require('./authorize');
const users = require('./routes/users.js');
const api = require('./routes/api.js');

app.use(express.json());
app.use('/users', users);
app.use('/api', authorize, api);
app.use(express.static('app'));

const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });

const hbs = require('hbs');
app.set('view engine', 'hbs');

app.get('/ui', (request, response) => {
  const data = {
    title: 'My Express App',
    items: ['item1', 'item2', 'item3']
  };
  response.render('index', data);
});