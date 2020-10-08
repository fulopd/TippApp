const express = require('express');
const app = express();
const port = 3999;
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

app.get('/api/:resData', (response, request) => {
    console.log('/api');
    const data = {};
    let resp_data = response.params.resData.split(',');
    let date, category;
    [date, category] = resp_data;
    console.log(category);
    db_guesses.find({ timestamp: date, category }).sort({ diff: 1 }).exec((err, docs) => {
        data.guesses = docs;
        db_result.find({ date: date, category }, (err, docs) => {
            data.res = docs;
            request.json(data);
        });
    });
});


app.post('/guessresult', (response, request) => {
    console.log('/guessresult');
    const data = response.body;
    console.log(data);

    db_result.find({ date: data.date, category: data.category }, (err, docs) => {
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
            db_guesses.find({ timestamp: data.date, category: data.category }, (err, docs) => {
                if (docs.length > 0) {
                    for (const item of docs) {
                        console.log(item);
                        let diff;
                        if (item.category == 'apple') {
                            let guess_value = item.guess_value.split(':');
                            let res_value = data.value.split(':');
                            diff = Math.abs((res_value[0] * 60 + res_value[1]) - (guess_value[0] * 60 + guess_value[1]));
                        } else {
                            diff = Math.abs(data.value - item.guess_value);
                        }
                        console.log(diff);
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