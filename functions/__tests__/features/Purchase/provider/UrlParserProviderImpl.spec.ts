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
    [
      "CFe35210509060964011720590007833501406811251697|20210502153116|66.02|96515104634|fFAG+RkGqQuIFyzsBUWHnGdjzkOKuCm2H3bneZbG8amtZ+3bp+S4+HCPdexUFSZz8gKGILIHX9lIxGzvgXP0gMz1rw4xA2RLZ80ppI3Zogwc8nqcT6M1kex0ziNB4gmrZjyQ/SOB3r7YeATVd/zvO0snfVVos6cVxGx/TibyjcU0ngX0B5ENNEEuvvN+Lsfh8jn1wR4KKS9yCBJ5FzAkpNfKtO+7I6dsIte9ZtnFSP/5l2fbXIqajDhFdNNhP/fp6BfT+XGzksttgo2uxEHsqam5ioUpUhLMplfZULOtvWoCNO1nKZppJy/gpYLLiPIY35SUQ4wuFaB2sOoUZt6wIA==",
      "SP",
      "35210509060964011720590007833501406811251697"
    ]

  ]).it(
    "should parse the url and return state and accessKey",
    (url, expectedUF, expectedAccessKey) => {
      const actual = sut.parseURL(url);
      expect(actual.accessKey).toEqual(expectedAccessKey);
      expect(actual.uf).toEqual(expectedUF);
    }
  );
});
