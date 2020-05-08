import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

import {
    RequestParse,
    RequestMethod,
    HandleRequest,
    ResponseStatus,
    ResponseData,
    ParsedRequest,
} from './model';
import { dataInstances } from './data-instances';
import { DataStorageFactory } from './DataStorageFactory';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));   // app use static???
app.use(bodyParser.json());

app.get('/', (req, res) => {        // app use static???
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


//move funtions to class? middlewares?? functions-folder??
const verifyDataStorage = (dataStorageName: string, method: RequestMethod): void => {
    const isStorageExist = dataInstances.hasOwnProperty(dataStorageName);
    const isFileStorageExist = fs.existsSync(`${__dirname}/data/${dataStorageName}.json`);
    // if (!isStorageExist && !isFileStorageExist && method !== 'post') {
    if (!isStorageExist) {
        if (isFileStorageExist || method === 'post') {
            dataInstances[dataStorageName] = new DataStorageFactory(dataStorageName);
        }
        else {
            throw new Error;
        }
    }
}

const handleRequest: HandleRequest = (method, req) => {
    const parsedRequest = parseEndpoint(req.params[0]);
    let data: any;
    let response: ResponseData = <any>{};

    try {
        verifyDataStorage(parsedRequest.storage, method);
        const storage = dataInstances[parsedRequest.storage];
        data = parsedRequest.propertiesPath
            ? storage[method + 'Child'](parsedRequest.propertiesPath, req.body)
            : storage[method](req.body);
        response.status = ResponseStatus.ok;

        if (data !== undefined) {
            response.data = data;
        }
    }
    catch(e) {
        response.status = ResponseStatus.error;
        response.errorMessage = e.message; // or e.name?????
    }

    return response;
};

// '/api/' parsing??? ignore??
const parseEndpoint: RequestParse = (endpoint) => { //change parameter name
    const parsedRequest: ParsedRequest = <any>{}
    console.log(endpoint);

    const propertiesPath = endpoint?.match(/^.*?\//)[0]; // remove '/' from match-return // check regexp correctness
    if (propertiesPath) {
        parsedRequest.storage = propertiesPath[0];
        parsedRequest.propertiesPath = endpoint.replace(`${propertiesPath[0]}/`, '');

        return parsedRequest;
    }

    parsedRequest.storage = endpoint;
    return parsedRequest;
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


        const responseData = handleRequest('post', req);
    })
    .get((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        // console.log('post', req.route);
        const responseData = handleRequest('get', req);

    })
    .put((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        console.log('post', req.route);
        const responseData = handleRequest('put', req);

    })
    .delete((req, res) => {
        console.log('post', req.body);
        // console.log('post', req);
        console.log('post', req.route);
        const responseData = handleRequest('delete', req);

    })

app.listen(3000, () => console.log('on3000'));
