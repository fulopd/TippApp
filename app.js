const express = require('express');
const app = express();
const port = 3999;
const Datastore = require('nedb');
const url = require('url');

const db_guesses = new Datastore({ filename: './database/guesses.db' });
const db_win = new Datastore({ filename: './database/win.db' });
db_guesses.loadDatabase();
db_win.loadDatabase();


app.use(express.static('public'));
app.use(express.json({ filesize: '1 mb' }));

app.listen(port, () => console.log(`Server listen on ${port} port.`));


app.post('/add', (response, request) => {
    console.log('/');
    let guessDate = new Date();
    const data = response.body;
    data.timestamp = guessDate.toISOString().substr(0, 10);
    db_guesses.insert(data);
    console.log(data);
    request.json({
        status: 'success',
        guess: data
    });
});

app.get('/api/:selDate', (response, request) => {
    console.log('/api');
    let date = response.params.selDate;
    db_guesses.find({ timestamp: date }, (err, docs) => {
        request.json(docs);
    });

});