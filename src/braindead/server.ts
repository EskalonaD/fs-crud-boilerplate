import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

import { DataStorageFactory, RequestParse, TRequestMethod, IRequest, THandleRequest } from './model'
import { dataInstances } from './data-instances';
import { parse } from 'querystring';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));   // app use static???
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


//move funtions to class? middlewares??
const verifyDataStorage = (dataStorageName: string, method: TRequestMethod): void => {
    const isStorageExist = dataInstances.hasOwnProperty(dataStorageName);
    const isFileStorageExist = fs.existsSync(`${__dirname}/data/${dataStorageName}.json`);
    // if (!isStorageExist && !isFileStorageExist && method !== 'post') {
    if (!isStorageExist) {
        // throw new Error;


        // if ()
        if (isFileStorageExist || method === 'post') {
            dataInstances[dataStorageName] = new DataStorageFactory(dataStorageName);
        }
        else {
            throw new Error;
        }
    }


}

const handleRequest: THandleRequest = (method, req) => {
    const parsedRequest = parseRequest(req.params[0]);

    verifyDataStorage(parsedRequest[0], method);

    if (parsedRequest.length === 1) {
        dataInstances[parsedRequest[0]][method](req.body);
    }
    else {
        dataInstances[parsedRequest[0]][method + 'Child'](parsedRequest[1], req.body);
    }
};


const handleErrors = (func: Function): void => {  //decorator????
    // try { func}
};

// '/api/' parsing??? ignore??
const parseRequest: RequestParse = (params) => { //change parameter name
    console.log(params);

    const awesomeVariable = params?.match(/^.*?\//)[0]; // find appropriate name // remove '/' from match-return
    if (awesomeVariable) {
        return [awesomeVariable[0], params.replace(`${awesomeVariable[0]}/`, '')]



        // const splittedParams = params.split('/');
        // return [splittedParams[0], splittedParams.splice(1).join]



        // return [params.match(/^.*?\//)
    }
    return [params]
};




app.route('*')      //add parent/child conditions/parsing
    .post((req, res) => { //if first - create dataStorage obj
        console.log('post', req.body);
        // console.log('post', req);
        // console.log('post', req.route);
        console.log('post', req.params);
        // console.log();

        // const parsedRequest = parseRequest(req.params[0]);
        // if (parsedRequest.length === 1) {
        //     dataInstances[parsedRequest[0]].post(req.body);
        // }
        // else {
        //     dataInstances[parsedRequest[0]].postChild(parsedRequest[1], req.body);
        // }

        handleRequest('post', req);
    })
    .get((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        // console.log('post', req.route);
        handleRequest('post', req);

    })
    .put((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        console.log('post', req.route);
        handleRequest('post', req);

    })
    .delete((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        console.log('post', req.route);
        handleRequest('post', req);

    })

app.listen(3000, () => console.log('on3000'));
