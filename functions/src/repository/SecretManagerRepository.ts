import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
const client = new SecretManagerServiceClient();

export class SecretManagerRepositoryException extends Error { }

export abstract class SecretManagerRepository {
    abstract async  getSecret(secretId: string): Promise<string>;

}

export class GCPSecretManagerRepository extends SecretManagerRepository {
    protected static instance: GCPSecretManagerRepository;

    private constructor(private _project_id: string) {
        super();
    }
    public static getInstance(_project_id: string): SecretManagerRepository {
        if (!GCPSecretManagerRepository.instance || (GCPSecretManagerRepository.instance._project_id !== _project_id)) {
            GCPSecretManagerRepository.instance = new GCPSecretManagerRepository(_project_id);
        }
        return GCPSecretManagerRepository.instance;
    }

    async getSecret(secretId: string): Promise<string> {
        const secretName = `projects/${this._project_id}/secrets/${secretId}/versions/latest`
        const [secret] = await client.accessSecretVersion({
            name: secretName
        });
        if (secret?.payload?.data) {
            const secretKey = secret.payload.data.toString();
            return secretKey;
        }
        else {
            throw new SecretManagerRepositoryException(`Cannot get ${secretId}`);
        }
    }
}
