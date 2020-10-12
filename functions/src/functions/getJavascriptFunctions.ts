import * as fs from 'fs';


export const getJavascriptFunctions = async (request: any, response: any) => {

    try {
        const state = request.params.state;
        const accessKey = request.query.accessKey;
        const repository = getJavascriptFunctionsByState;
        const fileData = repository(state);
        const javascriptFunctions = fileData.replace('$$ACCESS_KEY$$', accessKey);
        response.status(200).send({ javascriptFunctions });

    } catch (error) {
        response.status(500).send({ error });

    }


}

const getJavascriptFunctionsByState = (state: string) => {
    const fileName = `src/functions/javascriptFunctions.${state}.js`;
    const fileData: string = fs.readFileSync(fileName, 'utf8');
    return fileData;
} 
