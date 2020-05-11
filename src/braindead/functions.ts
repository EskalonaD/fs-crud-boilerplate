import fs from 'fs';

import {
    RequestMethod,
    HandleRequest,
    ResponseData,
    storageRequestMethod,
    ResponseStatus,
    RequestParse,
    ParsedRequest
} from "./model";
import { dataInstances } from "./data-instances";
import { DataStorageFactory } from "./DataStorageFactory";
import { config } from './configuration';


const verifyDataStorage = (storageName: string, method: RequestMethod): void => {
    const isStorageExist = dataInstances.hasOwnProperty(storageName);
    const isFileStorageExist = fs.existsSync(`${config.data_storage_path}/${storageName}.json`);
    if (!isStorageExist) {
        if (isFileStorageExist || ['post', 'put'].includes(method)) {
            dataInstances[storageName] = new DataStorageFactory(storageName);
        }
        else {
            throw new Error('Storage does not exist');
        }
    }
}

export const handleRequest: HandleRequest = (requestMethod, req) => {
    const parsedRequest = parseEndpoint(req.params[0]);
    let data: any;
    let response: ResponseData = <any>{};
    const methodName: storageRequestMethod = parsedRequest.propertiesPath
        ? <storageRequestMethod>`${requestMethod}Child`
        : requestMethod;

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

const parseEndpoint: RequestParse = (endpoint) => {
    const parsedRequest: ParsedRequest = <any>{}
    const parsedStorage = endpoint?.match(/.*?(?=\/)/)?.[0];

    if (parsedStorage) {
        parsedRequest.storage = parsedStorage;
        parsedRequest.propertiesPath = endpoint.replace(`${parsedStorage}/`, '').replace(/\/$/, '');

        return parsedRequest;
    }

    parsedRequest.storage = endpoint;
    return parsedRequest;
};
