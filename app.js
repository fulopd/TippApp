const express = require('express');
const app = express();
const port = 80;
const Datastore = require('nedb');

const db_guesses = new Datastore({ filename: './database/guesses.db' });
const db_result = new Datastore({ filename: './database/result.db' });
db_guesses.loadDatabase();
db_result.loadDatabase();

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
    const data = {};
    let date = response.params.selDate;
    db_guesses.find({ timestamp: date }).sort({ diff: 1 }).exec((err, docs) => {
        data.guesses = docs;
        db_result.find({ date: date }, (err, docs) => {
            data.res = docs;
            request.json(data);
        });
    });
});


app.post('/guessresult', (response, request) => {
    console.log('/guessresult');
    const data = response.body;
    console.log(data);

    db_result.find({ date: data.date }, (err, docs) => {
        console.log(docs.length);
        if (docs.length != 0) {
            console.log('Már létezik');
            request.json({
                status: 'failed',
                msg: 'Már létezik'
            });
        } else {
            console.log('Még nem létezik');
            db_result.insert(data);


            //már rögzített tippek kiegészítése eredmény eltéréssel
            db_guesses.find({ timestamp: data.date }, (err, docs) => {
                if (docs.length > 0) {
                    for (const item of docs) {
                        console.log(item);
                        const diff = Math.abs(data.value - item.guess_value);
                        db_guesses.update({ _id: item._id }, { $set: { diff: diff } }, {});
                    }
                    db_guesses.persistence.compactDatafile();
                }
            });



            console.log(data);
            request.json({
                status: 'success',
                guess: data
            });
        }
    });
});