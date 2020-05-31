import { ConfigurationObject } from "./model";


export const configuration: ConfigurationObject = {
    data_storage_path: `${__dirname}/data`,
    backup_storage_path: `${__dirname}/backup`,
    backup: false,
    backupCapacity: 10,
    auth: false,
    frontend_mode: false,
    frontend_path: null,
    test_mode: true,
    port: 3000,
}
