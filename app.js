const express = require('express');
const app = express();
const port = 3999;
const Datastore = require('nedb');

const db_guesses = new Datastore({ filename: './database/guesses.db' });
const db_result = new Datastore({ filename: './database/result.db' });
const db_categories = new Datastore({ filename: './database/categories.db' });
db_guesses.loadDatabase();
db_result.loadDatabase();
db_categories.loadDatabase();

app.use(express.static('public'));
app.use(express.json({ filesize: '1 mb' }));

app.listen(port, () => console.log(`Server listen on ${port} port.`));

//Új tipp rögzítése
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

//Új kategória felvétele
app.post('/newcategory', (response, request) => {
    console.log('/newcategory');
    const data = response.body;
    db_categories.insert(data);
    console.log(data);
    request.json({
        status: 'success',
        category: data
    });
});

//Katagóriák lekérdezése
app.get('/getcategories', (response, request) => {
    console.log('/getcategories');
    db_categories.find({}, (err, docs) => {
        request.json(docs);
    })
});

//Adatok lekérdezése
app.get('/api/:resData', (response, request) => {
    console.log('/api');
    const data = {};
    let resp_data = response.params.resData.split(',');
    let date, category;
    [date, category] = resp_data;
    db_guesses.find({ timestamp: date, 'category.id': category }).sort({ diff: 1 }).exec((err, docs) => {
        data.guesses = docs;
        db_result.find({ date: date, category }, (err, docs) => {
            data.res = docs;
            request.json(data);
            console.log(`"${category}" - kategória, ${date} - dátum adatai elküldve!`);
        });
    });
});

//végeredmény rögzítése, hozzá tartozó adatok frissítése
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
            db_guesses.find({ timestamp: data.date, "category.id": data.category }, (err, docs) => {
                if (docs.length > 0) {
                    for (const item of docs) {
                        console.log(item);
                        let diff;
                        if (item.guess_value.includes(':')) {
                            let guess_value = item.guess_value.split(':');
                            let res_value = data.value.split(':');
                            diff = Math.abs((res_value[0] * 60 + res_value[1]) - (guess_value[0] * 60 + guess_value[1]));
                            console.log(res_value[0], res_value[1], guess_value[0], guess_value[1]);
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