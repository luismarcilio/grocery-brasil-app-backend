import { FirebaseSecretManagerService } from "../services/SecretManagerServices";
import { project_id } from "../configuration";
import { GCPSecretManagerRepository } from "../repository/SecretManagerRepository";

export const getGeolocationApiKey = async (request: any, response: any) => {

    const secretManagerService = FirebaseSecretManagerService.getInstance(GCPSecretManagerRepository.getInstance(project_id));

    try {
        const geolocationApiKey: string = await secretManagerService.getGeolocationApiKey();
        response.status(200).send({ geolocationApiKey });
        return;
    } catch (error) {
        response.status(500).send(error);
        return;
    }


}