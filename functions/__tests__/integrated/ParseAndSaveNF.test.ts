import app from "../../src/presentation/express/app";
import * as request from "supertest";
import * as fs from "fs";
import { promisify } from "util";
import * as admin from "firebase-admin";

describe("Express Functions", () => {
  const readFilePromise = promisify(fs.readFile);
  

  it("should save the NF from MG", async () => {
    const htmlFile =
      "__tests__/features/Purchase/service/fixtures/valid_nf_from_mg.xhtml";
    jest.setTimeout(30000);
    const html = (await readFilePromise(htmlFile)).toString();
    const userId = "testUserId";
    const accessKey = "31200819867464000128650170000243111100316095";
    const firestore = admin.firestore();

    await firestore
      .collection("COMPRAS")
      .doc(userId)
      .collection("COMPLETA")
      .doc(accessKey)
      .delete();
    await firestore
      .collection("COMPRAS")
      .doc(userId)
      .collection("RESUMIDA")
      .doc(accessKey)
      .delete();
    await firestore.collection("COMPRAS").doc(userId).delete();

    const path = "/parseAndSaveNf/MG";
    const result = await request(app)
      .post(path)
      .send({ html })
      .set("Authorization", "Bearer " + "jwt");
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({ status: "SUCCESS" });
  });

  it("should save the NF from RJ", async () => {
    const htmlFile =
      "__tests__/features/Purchase/service/fixtures/valid_nf_from_rj.xhtml";
    jest.setTimeout(30000);
    const html = (await readFilePromise(htmlFile)).toString();
    const userId = "testUserId";
    const accessKey = "33200561585865044442650060001312301776030906";
    const firestore = admin.firestore();

    await firestore
      .collection("COMPRAS")
      .doc(userId)
      .collection("COMPLETA")
      .doc(accessKey)
      .delete();
    await firestore
      .collection("COMPRAS")
      .doc(userId)
      .collection("RESUMIDA")
      .doc(accessKey)
      .delete();
    await firestore.collection("COMPRAS").doc(userId).delete();

    const path = "/parseAndSaveNf/RJ";
    const result = await request(app)
      .post(path)
      .send({ html })
      .set("Authorization", "Bearer " + "jwt");
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({ status: "SUCCESS" });
  });

});
