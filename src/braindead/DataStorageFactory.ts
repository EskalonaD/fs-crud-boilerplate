import fs from 'fs';
import * as _ from 'lodash';

import { dataInstances } from './data-instances';
import { config } from './configuration';
import { postedValue } from './model';


export class DataStorageFactory {
    constructor(private name: string) {

        this.filePath = `${config.data_storage_path}/${this.name}.json`;

        this._data = fs.existsSync(this.filePath)
            ? JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
            : {};

        if (!fs.existsSync(this.filePath)) fs.writeFileSync(this.filePath, '{}', 'utf8');
    }

    protected filePath: string;
    protected _data: any;

    get data() {
        const remoteData = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));

        // needed for handling storage[prop] = data cases, cause in that cases getter is used instead of post;
        if (!_.isEqual(this._data, remoteData)) {
            fs.writeFileSync(this.filePath, JSON.stringify(this._data, null, 2), 'utf8');
        }

        this._data = remoteData;
        return this._data;
    }

    set data(value: any) {
        fs.writeFileSync(this.filePath, JSON.stringify(this._data, null, 2), 'utf8')
        this._data = value; // mb will work w\o this line??
    }

    private validateChildEndpoint(props: string[]): void {
        let data = this.data;

        props.forEach((el: any, i: number) => {
            if (i !== props.length - 1 && typeof data[el] !== 'object') {
                throw new Error;
            }

            data = data[el];
        })
    }

    private idStorage: number[] = [];

    private generateId(): number {
        let newId = Math.trunc(Math.random() * 10 ** 16);

        while (this.idStorage.includes(newId)) {
            newId = Math.trunc(Math.random() * 10 ** 16);
        }

        return newId;
    }

    private formatToPostType(data: any): postedValue {
        return {
            id: this.generateId(),
            data,
        }
    }

    private formatStorageForPost(data: any): [postedValue] {
        let isFormatted: boolean;

        // check if data already has needed format
        if (typeof data === 'object' && data !== null) {
            const dataKeys = Object.keys(data);
            isFormatted = dataKeys.includes('id')
                && dataKeys.includes('data')
        }

        if (isFormatted) {
            //check if id is formatted in right way. Format if needed;
            data.id = typeof data.id !== 'number'
                ? this.generateId()
                : data.id;

            return [data]
        }

        return [this.formatToPostType(data)]
    }

    /**
     * check if data in provided path is Array.
     * if yes: create object with type { id, data: payload } and return it;
     * if no: change data to array and fill it with existing data transformed to type above and add
     * payload transformed to same type
     */
    post(payload: any): postedValue {
        const objToStore = this.formatToPostType(payload);

        if (Array.isArray(this.data)) {

            this.data.push(objToStore);
        }
        else {
            this.data = this.formatStorageForPost(this.data);
            this.data.push(objToStore);
        }

        return objToStore;
    }

    put(payload: any): void {
        this.data = payload
    }

    get(): any {
        return this.data;
    }

    delete(): void {
        fs.unlinkSync(this.filePath);
        delete dataInstances[this.name];
    }

    /**
     * @param path expect string like 'prop/prop1/prop2/etc...'
     */
    getChild(path: string): any {
        const props = path.split('/');
        this.validateChildEndpoint(props);
        return _.get(this.data, props);
    }


    // TODO: remove id from idStorage
    deleteChild(path: string): void {
        const props = path.split('/');
        this.validateChildEndpoint(props);

        const propToDelete = props.pop();
        let data = _.get(this.data, props);
        delete data[propToDelete];
    }

    /**
     * check if data in provided path is Array.
     * if yes: create object with type { id, data: payload } and return it;
     * if no: change data to array and fill it with existing data transformed to type above and add
     * payload transformed to same type
     */
    postChild(path: string, payload: any): postedValue {
        const props = path.split('/');
        this.validateChildEndpoint(props);

        let data = _.get(this.data, props);
        const objToStore = this.formatToPostType(payload);

        if (Array.isArray(data)) {

            data.push(objToStore);
        }
        else {
            const dataParent = _.get(this.data, props.slice(0, props.length - 1));

            data = this.formatStorageForPost(data);
            data.push(objToStore);
            dataParent[props[props.length - 1]] = data;
        }

        return objToStore;
    }

    /**
     * @param path doesn't include id of updated element
     * if data in provided path is array then data-property in object with same id will be updated;
     *
     * if data in provided path is not array whole data will be updated;
     */
    putChild(path: string, payload: any) { // TODO: change payload type to any | postedValue - add guard
        const props = path.split('/');
        this.validateChildEndpoint(props);

        let data = _.get(this.data, props);

        if (Array.isArray(data)) {
            const objToUpdate: postedValue = data.find((el: postedValue) => payload.id === el.id);
            if (!objToUpdate) throw new Error;

            objToUpdate.data = payload.data;
        }
        else {
            const dataParent = _.get(this.data, props.slice(0, props.length - 1));

            dataParent[props[props.length - 1]] = payload;
        }
    }

}
