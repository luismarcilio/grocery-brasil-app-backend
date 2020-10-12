import { Storage } from '@google-cloud/storage'
import { logger } from '../logger';


export abstract class FilestoreRepository {
    abstract saveFile(content: Buffer, bucket: string, fileName: string, metaData: any): Promise<void>
}


export class GcpFilestoreRepository extends FilestoreRepository {
    private storage = new Storage();

    private static instance: GcpFilestoreRepository;
    private constructor() {
        super();
    }

    public static getInstance(): FilestoreRepository {
        if (!this.instance) {
            this.instance = new GcpFilestoreRepository();
        }
        return this.instance;
    }

    async saveFile(content: Buffer, bucket: string, fileName: string, contentType: string) {
        const writeStream = this.storage.bucket(bucket).file(fileName)
            .createWriteStream({
                gzip: true,
                public: true,
                resumable: false,
                metadata: {
                    contentType
                }
            });
        writeStream
            .on('error', (err) => { logger.error('writeStream: ', JSON.stringify(err)); throw err })
            .on('finish', () => logger.info(`finished saving https://storage.googleapis.com/${bucket}/${fileName}`))
            .end(content);
    }

}