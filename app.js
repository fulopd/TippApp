const express = require('express');
const app = express();
const port = 3999;
const Datastore = require('nedb');

const db = new Datastore({filename: 'database.db'});
db.loadDatabase();


app.use(express.static('public'));
app.use(express.json({filesize: '1 mb'}));

app.listen(port, () => console.log(`Server listen on ${port} port.`));


app.post('/add', (response, request) => {
    console.log('/');
    const data = response.body;
    data.timestamp = Date.now();
    db.insert(data);
    console.log(data);
    request.json({
        status: 'success',
        guess: data
    });
});


app.get('/api', (response, request) => {
    console.log('/api');
    let db_data = db.getAllData();
    console.log(db_data);
    request.json(db_data);
    request.end();    
});
