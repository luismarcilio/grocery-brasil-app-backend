
import { readFile } from 'fs';
import { promisify } from 'util';
import * as parseNfMg from '../src/business/mg/parseNf';
import * as parseNfRj from '../src/business/rj/parseNf';
import { FirebaseRepository } from '../src/repository/FirebaseRepository';
import { GeolocationApiServicesImplementation } from "../src/services/GeolocationApiServices";
import { GCPGeolocationApiRepository } from "../src/repository/GeoocationApiRepository";
import { FirebaseSecretManagerService, } from '../src/services/SecretManagerServices';
import { GCPSecretManagerRepository } from '../src/repository/SecretManagerRepository';
import { project_id } from '../src/configuration';



describe("parse NF", () => {
    it("Should parse MG invoice", async () => {
        const readFilePromise = promisify(readFile);

        const data = await readFilePromise('__tests__/consultaresumida.xhtml');
        const purchase = parseNfMg.parseNf(data.toString());
        expect(purchase).toBeDefined();
        if (purchase === undefined) {
            return;
        }
        expect(purchase.fiscalNote.accessKey).toBe('31200819867464000128650170000243111100316095');
        expect(purchase.fiscalNote.number).toBe('24311');
        expect(purchase.fiscalNote.series).toBe('17');
        expect(purchase.fiscalNote.company).toStrictEqual(
            {
                'name': 'LS GUARATO LTDA',
                'taxIdentification': '19.867.464/0001-28',
                'address':
                {
                    'rawAddress': ' R. NOVO HORIZONTE, 948 SAO SEBASTIAO UBERABA, MG , CEP: 38060480'
                }
            });

        const totalValue = purchase.purchaseItemList.map(p => p.totalValue).reduce((v1, v2) => v1 + v2, 0);
        expect(totalValue).toBeCloseTo(460.37);
    }
    );

    it("Should parse RJ invoice", async () => {
        const readFilePromise = promisify(readFile);

        const data = await readFilePromise('__tests__/resultadoDfeDetalhado.xhtml');
        const purchase = parseNfRj.parseNf(data.toString());
        expect(purchase).toBeDefined();
        if (purchase === undefined) {
            return;
        }

        expect(purchase.fiscalNote.accessKey).toBe('33200561585865044442650060001312301776030906');
        expect(purchase.fiscalNote.number).toBe('131230');
        expect(purchase.fiscalNote.series).toBe('6');
        expect(purchase.fiscalNote.company).toStrictEqual(
            {
                name: 'RAIADROGASIL S.A.',
                taxIdentification: '61.585.865/0444-42',
                address:
                {
                    rawAddress:
                        'AVENIDA NOSSA SENHORA DE COPACABANA,734 COPACABANA, CEP: 22050-001'
                }
            }
        );

        const totalValue = purchase.purchaseItemList.map(p => p.totalValue).reduce((v1, v2) => v1 + v2, 0);
        expect(totalValue).toBeCloseTo(113.28);
    }
    );


});

describe('Integrated tests', () => {
    beforeAll(() => {
        FirebaseRepository.getIinstance();
    });

    it("should return the address", async () => {
        jest.setTimeout(10000);
        const firebaseSecretManagerService = FirebaseSecretManagerService.getInstance(
            GCPSecretManagerRepository.getInstance(project_id)
        );
        const secret = await firebaseSecretManagerService.getGeolocationApiKey();
        const geolocationApiServices = GeolocationApiServicesImplementation.getInstance(
            GCPGeolocationApiRepository.getInstance(secret)
        );

        const rawAddress = 'R. NOVO HORIZONTE, 948, SAO SEBASTIAO, 3170107 - UBERABA, MG';
        const address = await geolocationApiServices.getFullAddress(rawAddress);
        expect(address).toStrictEqual({
            'rawAddress':
                'R. Novo Horizonte, 948 - Mercês, Uberaba - MG, 38060-480, Brazil',
            'street': 'Rua Novo Horizonte',
            'number': '948',
            'poCode': '38060-480',
            'county': 'Mercês',
            'city': { 'name': 'Uberaba' },
            'state': { 'name': 'Minas Gerais', 'acronnym': 'MG' },
            'country': { 'name': 'Brazil' },
            'lat': -19.7489062,
            'lon': -47.9477631
        });
    });

});