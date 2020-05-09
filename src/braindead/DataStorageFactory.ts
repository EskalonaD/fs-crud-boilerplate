import fs from 'fs';
import * as _ from 'lodash';

import { dataInstances } from './data-instances';
import { config } from './configuration';


export class DataStorageFactory {
    constructor (private name: string) {

        this.filePath = `${config.data_storage_path}/${name}.json`;

        this._data = fs.existsSync(this.filePath)
            ? JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
            : null;

        if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, 'null', 'utf8');
    }

    protected filePath: string;
    protected _data: any;

    get data() {
        const remoteData = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));

        if (!_.isEqual(this._data, remoteData)) {
            fs.writeFileSync(this.filePath, JSON.stringify(this._data, null, 2), 'utf8');
        }

        this._data = remoteData;
        console.log('data parsed');
        return this._data;
    }

    set data(value: any) {
        fs.writeFileSync(this.filePath, JSON.stringify(this._data, null, 2), 'utf8')
        this._data = value;
        console.log('data saved')
    }

    post(payload: any) {

    }

    put(payload: any){

    }

    get() {
        return this.data;
    }

    delete() {

        fs.unlinkSync(this.filePath);
        delete dataInstances[this.name];

    }

    getChild(path: string) {

    }

    deleteChild(path: string) {

    }

    postChild(path: string, payload: any) {

    }

    putChild(path: string, payload: any) {

    }

}
