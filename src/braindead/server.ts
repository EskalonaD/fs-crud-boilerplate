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
    storageRequestMethod,
} from './model';
import { dataInstances } from './data-instances';
import { DataStorageFactory } from './DataStorageFactory';
import { config } from './configuration';
import { TEST_PATH } from './constants';


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (config.test_mode || config.frontend_mode) {
    app.use(express.static(config.test_mode ? TEST_PATH : config.frontend_path));
}

//move funtions to class? middlewares?? functions-folder??
const verifyDataStorage = (dataStorageName: string, method: RequestMethod): void => {
    const isStorageExist = dataInstances.hasOwnProperty(dataStorageName);
    const isFileStorageExist = fs.existsSync(`${__dirname}/data/${dataStorageName}.json`);
    // if (!isStorageExist && !isFileStorageExist && method !== 'post') {
    if (!isStorageExist) {
        if (isFileStorageExist || ['post', 'put'].includes(method)) {
            dataInstances[dataStorageName] = new DataStorageFactory(dataStorageName);
        }
        else {
            throw new Error;
        }
    }
}

const handleRequest: HandleRequest = (requestMethod, req) => {
    const parsedRequest = parseEndpoint(req.params[0]);
    let data: any;
    let response: ResponseData = <any>{};
    const methodName: storageRequestMethod = parsedRequest.propertiesPath
        ? <storageRequestMethod>`${requestMethod}Child` : requestMethod;

    try {
        verifyDataStorage(parsedRequest.storage, requestMethod);
        const storage = dataInstances[parsedRequest.storage];

        data = parsedRequest.propertiesPath
            ? storage[methodName](parsedRequest.propertiesPath, req.body)
            : (<any>storage)[methodName](req.body);
        response.status = ResponseStatus.ok;

        if (data !== undefined) {
            response.data = data;
        }
    }
    catch (e) {
        response.status = ResponseStatus.error;
        response.errorMessage = e.message;
    }

    return response;
};

// '/api/' parsing??? ignore??
const parseEndpoint: RequestParse = (endpoint) => {
    const parsedRequest: ParsedRequest = <any>{}
    console.log('endpoint');
    console.log(endpoint);

    const parsedStorage = endpoint?.match(/.*?(?=\/)/)?.[0]; // add regexp for api/storage case
    console.log(parsedStorage)
    if (parsedStorage) {
        parsedRequest.storage = parsedStorage;
        parsedRequest.propertiesPath = endpoint.replace(`${parsedStorage}/`, '').replace(/\/$/, '');
        console.log('parsed')
        console.log(parsedRequest.propertiesPath);
        return parsedRequest;
    }

    parsedRequest.storage = endpoint;
    return parsedRequest;
};

app.route('/api/*')
    .get((req, res) => {
        console.log('get', config.test_mode || config.frontend_mode);
        console.log('get', req.params);

        const responseData = handleRequest('get', req);

        res.status(responseData.status).send(responseData.errorMessage || responseData.data);       //res.json instead of res.send ?!
    })
    .post((req, res) => {
        console.log('post', req.body);
        console.log('post', req.params[0]);
        const responseData = handleRequest('post', req);

        res.status(responseData.status).send(responseData.errorMessage || responseData.data);
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
    });

app.listen(config.port, () => console.log(`on ${config.port}`));
