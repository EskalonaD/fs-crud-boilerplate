import { ParamsDictionary } from '../../node_modules/@types/express-serve-static-core/index';
import { DataStorageFactory } from './DataStorageFactory';

interface Request {
    params: ParamsDictionary;
    body: any
};

export type RequestMethod = 'get' | 'put' | 'post' | 'delete';

export type storageRequestMethod = 'get'
                                    | 'put'
                                    | 'post'
                                    | 'delete'
                                    | 'getChild'
                                    | 'putChild'
                                    | 'postChild'
                                    | 'deleteChild';

export interface IDataInstances {
    [key: string]: DataStorageFactory
};

export type ParsedRequest = { storage: string, propertiesPath?: string };

export type RequestParse = (resParam: string) => ParsedRequest;

export type HandleRequest = (method: RequestMethod, req: Request) => ResponseData;

export enum ResponseStatus {
    ok = 200,
    error = 400,
};

export interface ResponseData {
    status: ResponseStatus;
    errorMessage?: string;
    data: any;
};

export interface postedValue {
    id: number;
    data: any;
}
