const express = require('express');
const app = express();
const port = 3999;
const Datastore = require('nedb');

const db = new Datastore({filename: 'database.db'});
db.loadDatabase();


app.use(express.static('public'));
app.use(express.json({filesize: '1 mb'}));

app.listen(port, () => console.log(`Server listen on ${port} port.`));


app.post('/', (response, request) => {
    console.log('/');
    const data = response.body;
    db.insert(data);
    console.log(data);
    request.json({
        status: 'success',
        guess: data
    });
});