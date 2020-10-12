import { FilestoreRepository } from "../repository/FilestoreRepository";
import * as FileType from 'file-type';

export abstract class FilestoreServices {
    protected _repository: FilestoreRepository
    protected constructor(_repository: FilestoreRepository) {
        this._repository = _repository;
    }

    abstract saveFile(content: Buffer, bucket: string, filename: string): Promise<void>;
}

export class FilestoreServicesImplementation extends FilestoreServices {

    private static instance: FilestoreServices;

    private constructor(_repository: FilestoreRepository) {
        super(_repository);
    }

    public static getInstance(_repository: FilestoreRepository) {
        if (!this.instance) {
            this.instance = new FilestoreServicesImplementation(_repository)
        }
        return this.instance;
    }


    async saveFile(content: Buffer, bucket: string, filename: string): Promise<void> {
        const fileType = await FileType.fromBuffer(content);
        await this._repository.saveFile(content, bucket, filename, fileType?.mime);
    }
}