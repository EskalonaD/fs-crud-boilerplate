import fs from 'fs';
import { dataInstances } from './data-instances';

export class DataStorageFactory {
    constructor (private name: string) { // schema IS base data // schema is object for now

        const baseFilePath: string = `${__dirname}/base-data/${name}.json`;
        this.filePath = `${__dirname}/data/${name}.json`;

        this._data = fs.existsSync(this.filePath)
            ? JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
            : fs.existsSync(baseFilePath)       // encapsulate in method, maybe remove;
                ? JSON.parse(fs.readFileSync(baseFilePath, 'utf8'))
                : null;

        if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, '{}', 'utf8'); // mb null instead of {}? // does it needed?

    }

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

    post(payload: any) {

    }

    put(payload: any){

    }

    get() {
        return this.data; //check if this is actually get. check CRUD API info. mby get one item?
    }

    delete() {

        fs.unlinkSync(this.filePath);
        delete dataInstances[this.name];

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
