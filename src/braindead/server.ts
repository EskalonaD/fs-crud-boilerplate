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
});

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
const parseEndpoint: RequestParse = (endpoint) => {
    const parsedRequest: ParsedRequest = <any>{}
    console.log(endpoint);

    const parsedStorage = endpoint?.match(/(?<=\/).*?(?=\/)/)[0];
    if (parsedStorage) {
        parsedRequest.storage = parsedStorage;
        parsedRequest.propertiesPath = endpoint.replace(`/${parsedStorage}/`, '').replace(/\/$/, '');

        return parsedRequest;
    }

    parsedRequest.storage = endpoint;
    return parsedRequest;
};

app.route('*')
    .post((req, res) => {
        console.log('post', req.body);
        console.log('post', req.params);
        const responseData = handleRequest('post', req);

        res.status(responseData.status).send(responseData.errorMessage || responseData.data);
    })
    .get((req, res) => {
        console.log('get', req.body);
        console.log('get', req.params);
        const responseData = handleRequest('get', req);

        res.status(responseData.status).send(responseData.errorMessage || responseData.data);       //res.json instead of res.send ?!
    })
    .put((req, res) => {
        console.log('put', req.body);
        console.log('put', req.params);
        const responseData = handleRequest('put', req);

        res.status(responseData.status).send(responseData.errorMessage || responseData.data);
    })
    .delete((req, res) => {
        console.log('delete', req.body);
        console.log('delete', req.params);
        const responseData = handleRequest('delete', req);

        res.status(responseData.status).send(responseData.errorMessage || responseData.data);
    })

app.listen(3000, () => console.log('on3000'));
