import express from 'express';
import bodyParser from 'body-parser';

import { DataStorageFactory } from './model'

const app = express();

app.use(bodyParser.urlencoded({extended: true}));   // app use static???
app.use(bodyParser.json());

const a = new DataStorageFactory('users'); // put to another file?

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/frontend'/index.html`);
    // res.sendFile(__dirname + '/index.html');
});

// app.post('/quotes', (req, res) => {
//     console.log('post', req.body);
//     // console.log('post', req);
//     console.log('post', req.route);
// });

// app.put('/quotes', (req, res) => {
//     console.log('put', req.body);
// });

// app.delete('/quotes', (req, res) => {
//     console.log('delete', req.body);
// })

app.route('*')      //add parent/child conditions/parsing
    .post((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        // console.log('post', req.route);
        console.log('post', req.params);
        // console.log();
    })
    .get((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        // console.log('post', req.route);
    })
    .put((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        console.log('post', req.route);
    })
    .delete((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        console.log('post', req.route);
    })

app.listen(3000, () => console.log('on3000'));
