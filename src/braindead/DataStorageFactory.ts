import fs from 'fs';
import * as _ from 'lodash';

import { dataInstances } from './data-instances';
import { config } from './configuration';
// import { DATA_STORAGE_PATH } from './paths';

export class DataStorageFactory {
    constructor(private name: string) { // schema IS base data // schema is object for now

        // const baseFilePath: string = `${__dirname}/base-data/${name}.json`;
        this.filePath = `${config.data_storage_path}/${this.name}.json`;

        this._data = fs.existsSync(this.filePath)
            ? JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
            // : fs.existsSync(baseFilePath)       // encapsulate in method, maybe remove;
            // ? JSON.parse(fs.readFileSync(baseFilePath, 'utf8'))
            : {};

        if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, '{}', 'utf8');
    }

    protected filePath: string;
    protected _data: any;

    get data() {
        const remoteData = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));


        // need for handling storage[prop] = data cases, cause in that cases getter is used instead of post;
        if (!_.isEqual(this._data, remoteData)) {
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

    private validateChildEndpoint(props: string[]): any {
        let data = this.data;

        props.forEach((el: any, i: number) => {
            if (i !== props.length - 1 && typeof data[el] !== 'object') {
                throw new Error;
            }

            data = data[el];
        })
    }

    private idGen(): number {
        return Math.trunc(Math.random() * 10 ** 16);
    }

    post(payload: any): void {
        this.data[this.idGen()] = payload;
    }

    put(payload: any): void {
        this.data = payload
    }

    get(): any {        // id-param???
        return this.data; //check if this is actually get. check CRUD API info. mby get one item?
    }

    delete() {
        fs.unlinkSync(this.filePath);
        delete dataInstances[this.name];
    }

    // pass req.params parse and use for some sort like lodash arguments for multiple level child use?


/**
 * @param path expect string like 'prop/prop1/prop2/etc...'
 */
    getChild(path: string): any {
        const props = path.split('/');

        this.validateChildEndpoint(props);
        return _.get(this.data, props);

    }



    deleteChild(path: string): void {
        const props = path.split('/');
        let data: any;

        this.validateChildEndpoint(props);

        const propToDelete = props.pop();
        data = _.get(this.data, props);
        delete data[propToDelete];
    }

    postChild(path: string, payload: any): void {

    }

    putChild(path: string, payload: any) {

    }

}
