import * as minify from 'minify';

export const getNfDataByInitialUrl = async (request: any, response: any) => {

    const urlString = request.query.url;
    console.log('urlString:', urlString);
    const stateFromUrl = findState(new URL(urlString));
    const stateArray = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    const index = stateArray.includes(stateFromUrl);
    if (index === undefined) {
        response.status(400).send(`Bad Request. Cannot find state for URL: ${urlString}`);
    }

    const initalUrl: string = initialUrlConfig[stateFromUrl];
    if (!initalUrl) {
        response.status(404).send(`Not Found. State for URL not implemented: ${urlString}`);
    }

    const accessKey = getAccessKey(urlString) || '';
    let javaScriptFunctions = await getJavascriptFunctionsByState(stateFromUrl);
    javaScriptFunctions = `javascript:${javaScriptFunctions}`;
    javaScriptFunctions = javaScriptFunctions.replace('$$ACCESS_KEY$$', accessKey);
    response.status(200).send({ 'initialUrl': initalUrl, 'state': stateFromUrl, 'accessKey': accessKey, 'javascriptFunctions': javaScriptFunctions });

}

function getAccessKey(urlString: string) {
    const url: URL = new URL(urlString);
    const queryParameters = url.searchParams
    const pParameter = queryParameters.get('p');
    const accessKey = pParameter?.split('|')[0];
    return accessKey;
}

function findState(url: URL): string {
    const hostParts = url.hostname.split('.');
    const state = hostParts[hostParts.length - 3].toUpperCase();
    return state;
}

const initialUrlConfig: any = {
    'RJ': 'http://www4.fazenda.rj.gov.br/consultaDFe/paginas/consultaChaveAcesso.faces',
    'MG': 'http://nfce.fazenda.mg.gov.br/portalnfce/sistema/consultaarg.xhtml'
}

const getJavascriptFunctionsByState = async (state: string) => {
    const fileName = `src/functions/javascriptFunctions.${state}.js`;
    const options = {
        html: {
            removeAttributeQuotes: false,
            removeOptionalTags: false
        },
    };
    const fileData: string = await minify(fileName, options)
    return fileData;
} 
