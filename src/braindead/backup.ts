import { Backup as IBackup } from "./model";
import { configuration as config } from "./configuration";


/**
 * save data once per day before first operation on data;
 */
class Backup implements IBackup {
    constructor(filePath: string, backupAmount: number) {
        this.backupStoragePath = filePath;
        this.maxBackupAmount = backupAmount;
    }

    backupStoragePath: string;
    currentDate: Date;
    lastBackupDate: Date;
    maxBackupAmount: number;
    currentBackupAmount:number;

    backupData(dataName: string, data: object): void {
        //check if folder exist => create if not
        //create new folder inside 'data-folder' place json witth backup hthere
        // this.deleteOldData('data-folder');
    };

    private deleteOldData(folderPath: string): void {
        if(this.currentBackupAmount >= this.maxBackupAmount) {

        }
    }
}

export const backupService = new Backup(config.backup_storage_path, config.backupCapacity); //move to separate file?
