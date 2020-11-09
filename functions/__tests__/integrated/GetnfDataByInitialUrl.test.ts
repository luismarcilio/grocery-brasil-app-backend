import app from "../../src/presentation/express/app";
import * as request from "supertest";

describe("Express Functions", () => {
  describe("GET /nfDataByInitialUrl", () => {
    // beforeAll(async () => {
    //   const rjJavasScript = fs.readFileSync(
    //     "/home/amdocs/personalProjects/grocery-brasil-app-backend/functions/src/functions/javascriptFunctions.RJ.js"
    //   );
    //   const mgJavasScript = fs.readFileSync(
    //     "/home/amdocs/personalProjects/grocery-brasil-app-backend/functions/src/functions/javascriptFunctions.MG.js"
    //   );
    //   const firestore = admin.firestore();
    //   await firestore.collection("CONFIG").doc("RJ").set({
    //     initialURL:
    //       "http://www4.fazenda.rj.gov.br/consultaDFe/paginas/consultaChaveAcesso.faces",
    //     javascript: rjJavasScript.toString(),
    //   });
    //   await firestore.collection("CONFIG").doc("MG").set({
    //     initialURL:
    //       "http://nfce.fazenda.mg.gov.br/portalnfce/sistema/consultaarg.xhtml",
    //     javascript: mgJavasScript.toString(),
    //   });
    // });
    it("should not fail authentication", async () => {
      jest.setTimeout(30000);
      const url = new URLSearchParams();
      const expected = {
        initialUrl:
          "http://nfce.fazenda.mg.gov.br/portalnfce/sistema/consultaarg.xhtml",
        uf: "MG",
        accessKey: "31200819867464000128650170000243111100316095",
        javascriptFunctions:
          'javascript:const jsFunctions=()=>{const t=document.URL,c=t.match("consultaarg.xhtml"),e=t.match("consultaresumida.xhtml");if(c){try{document.getElementById("formPrincipal:chaveacesso").value="31200819867464000128650170000243111100316095"}catch(t){}try{document.querySelector("div.col-xs-12.col-md-2.col-lg-2 > a").click()}catch(t){}}else if(e)return document.documentElement.outerHTML};Print.postMessage(jsFunctions());',
      };
      url.set(
        "url",
        "https://nfce.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31200819867464000128650170000243111100316095|2|1|1|AD873D0784198A32E0F158E04D63E21EF070EDFF"
      );

      const path = `/nfDataByInitialUrl?${url.toString()}`;
      const result = await request(app)
        .get(path)
        .set("Authorization", "Bearer " + "jwt");
      expect(result.status).toEqual(200);
      expect(result.body).toEqual(expected);
    });
  });
});
