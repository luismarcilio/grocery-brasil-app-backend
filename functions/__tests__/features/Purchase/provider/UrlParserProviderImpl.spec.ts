import each from "jest-each";
import { UrlParserProvider } from "../../../../src/features/Purchase/provider/UrlParserProvider";
import { UrlParserProviderImpl } from "../../../../src/features/Purchase/provider/UrlParserProviderImpl";

/* 
    The most strct implementation here would be an abstract factory
    but right now all states use the same implementation.

    We break the OCP and if necessary we refactor later.
*/

describe("UrlParserProviderImpl", () => {
  const sut: UrlParserProvider = new UrlParserProviderImpl();
  each([
    [
      "https://nfce.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31200819867464000128650170000243111100316095|2|1|1|AD873D0784198A32E0F158E04D63E21EF070EDFF",
      "MG",
      "31200819867464000128650170000243111100316095",
    ],
    [
      "http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode?p=33200561585865044442650060001312301776030906|2|1|1|1D65F910125BE680F492E583CECEB544845BB63F",
      "RJ",
      "33200561585865044442650060001312301776030906",
    ],
  ]).it(
    "should parse the url and return state and accessKey",
    (url, expectedUF, expectedAccessKey) => {
      const actual = sut.parseURL(url);
      expect(actual.accessKey).toEqual(expectedAccessKey);
      expect(actual.uf).toEqual(expectedUF);
    }
  );
});
