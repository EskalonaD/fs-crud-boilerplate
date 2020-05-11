import { ConfigurationObject } from "./model";

export const config: ConfigurationObject = {
    data_storage_path: `${__dirname}/data`,
    backup_storage_path: `${__dirname}/backup`,
    backup: false,
    auth: false,
    frontend_path: `${__dirname}/front-end`
}
