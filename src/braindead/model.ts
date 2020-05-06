// interface IRequest {
//     // params: string,
//     params: string,
// }

export interface IDataInstances {
    [key: string]: DataStorageFactory
}

type IParsedRequest = [string, string?];
export type RequestParse = (parameter: string) => IParsedRequest;








/**
 * two level data
 */
import fs from 'fs';

export class DataStorageFactory {
    constructor(name: string, schema, baseData, private type) { // schema IS base data // schema is object for now

        const baseFilePath: string = `${__dirname}/base-data/${name}.json`;
        this.filePath = `${__dirname}/data/${name}.json`;

        this._data = fs.existsSync(this.filePath)
            ? JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
            : fs.existsSync(baseFilePath)
                ? JSON.parse(fs.readFileSync(baseFilePath, 'utf8'))
                : null;

        if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, '{}', 'utf8'); // mb null instead of {}?


        if (typeof schema === 'object') this.schemaFields = Object.keys(schema);

    }

    private schemaFields;       //paste on post if none is provided at initialization?/

    protected filePath: string;
    protected _data: any;

    get data() {
        const remoteData = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));

        if (this._data !== remoteData) {        // could cause problem if multiple simultenious connections to same file occurs;
            fs.writeFileSync(this.filePath, JSON.stringify(this._data, null, 2), 'utf8');
        }

        this._data = remoteData;
        console.log('data parsed');
        return this._data;
    }

    set data(value: any) {
        fs.writeFileSync(this.filePath, JSON.stringify(this._data, null, 2), 'utf8')
        this._data = value; // mb will work w\o this line??
        console.log('data saved')
    }

    post(data: object) { //payload: any
        if(this.schemaFields.every(prop => data.hasOwnProperty(prop))) {

        }
        else {
            throw Error;
        }

    }

    put(payload: any){

    }

    get() {
        return this.data; //check if this is actually get. check CRUD API info. mby get one item?
    }

    delete() {

        fs.unlinkSync(this.filePath);

    }

    // pass req.params parse and use for some sort like lodash arguments for multiple level child use?


    getChild(path: string) {

    }



    deleteChild(path: string) {

    }

    postChild(path: string, payload: any) {

    }

    putChild(path: string, payload: any) {

    }

}
