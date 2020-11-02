import * as NodeCache from "node-cache";
import { WebViewScrapDataRepository } from "../../../../src/features/Purchase/data/WebViewScrapDataRepository";
import { WebViewScrapDataRepositoryFirebase } from "../../../../src/features/Purchase/data/WebViewScrapDataRepositoryFirebase";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import * as FirebaseFirestore from "@google-cloud/firestore";

describe("WebViewScrapDataRepositoryFirebase", () => {
  //*DATA MODEL:
  //*COLLECTION('CONFIG').DOC(uf) = {initialURl: string, javascript:string}

  //NodeCache could be an adapter here but very unlikely this dependency will, in the future, break the OCP
  const set = jest.fn();
  const get = jest.fn();
  const cache: NodeCache = ({ set, get } as unknown) as NodeCache;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const collection = jest.fn((_) => ({ doc }));
  const firestore = ({
    collection,
  } as unknown) as FirebaseFirestore.Firestore;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const doc = jest.fn((_) => ({ get: getFromFirebase }));
  const getFromFirebase = jest.fn(() =>
    Promise.resolve({ exists: true, data })
  );
  const data = jest.fn(() => expected);
  const expected = { initialURL: "initialURL", javascript: "javascript" };

  const sut: WebViewScrapDataRepository = new WebViewScrapDataRepositoryFirebase(
    firestore,
    cache
  );

  describe("getUrlByUF", () => {
    it("should bring the information from chache if available", async () => {
      get.mockReturnValue(expected.initialURL);
      const actual = await sut.getUrlByUF("MG");
      expect(actual).toEqual("initialURL");
      expect(get).toHaveBeenCalledWith("urlByUF(MG)");
      expect(collection).not.toHaveBeenCalled();
    });
    it("should bring the initial url from firestore", async () => {
      get.mockReturnValue(undefined);
      const actual = await sut.getUrlByUF("MG");
      expect(actual).toEqual("initialURL");
      expect(get).toHaveBeenCalledWith("urlByUF(MG)");
      expect(collection).toHaveBeenCalledWith("CONFIG");
      expect(doc).toHaveBeenCalledWith("MG");
    });
    it("should cache the information if only available in firestore", async () => {
      get.mockReturnValue(undefined);
      const actual = await sut.getUrlByUF("MG");
      expect(actual).toEqual("initialURL");
      expect(set).toHaveBeenCalledWith("urlByUF(MG)", "initialURL");
    });
    it("should throw error NOT_FOUND if it's not found in firestore", async () => {
      get.mockReturnValue(undefined);
      getFromFirebase.mockReturnValueOnce(
        Promise.resolve({ exists: false, data })
      );
      const expected = new PurchaseException({
        messageId: MessageIds.NOT_FOUND,
        message: "No data found for UF: [MG]",
      });
      await expect(sut.getUrlByUF("MG")).rejects.toEqual(expected);
    });
    it("should throw error UNEXPECTED if an exception occurs", async () => {
      const exception = new Error("error");
      const expected = new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: (exception as unknown) as string,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get.mockImplementation((_) => {
        throw exception;
      });
      await expect(sut.getUrlByUF("MG")).rejects.toEqual(expected);
    });
  });
  describe("getWebViewJavascriptByUF", () => {
    it("should bring the information from chache if available", async () => {
    jest.clearAllMocks();
      get.mockReturnValue(expected.javascript);
      const actual = await sut.getWebViewJavascriptByUF("MG");
      expect(actual).toEqual("javascript");
      expect(get).toHaveBeenCalledWith("webViewJavascriptByUF(MG)");
      expect(collection).not.toHaveBeenCalled();
    });
    it("should cache the information if only available in firestore", async () => {
      get.mockReturnValue(undefined);
      const actual = await sut.getWebViewJavascriptByUF("MG");
      expect(actual).toEqual("javascript");
      expect(get).toHaveBeenCalledWith("webViewJavascriptByUF(MG)");
      expect(collection).toHaveBeenCalledWith("CONFIG");
      expect(doc).toHaveBeenCalledWith("MG");
    });

    it("should bring javascript from firestore", async () => {
      get.mockReturnValue(undefined);
      const actual = await sut.getWebViewJavascriptByUF("MG");
      expect(actual).toEqual("javascript");
      expect(get).toHaveBeenCalledWith("webViewJavascriptByUF(MG)");
      expect(collection).toHaveBeenCalledWith("CONFIG");
      expect(doc).toHaveBeenCalledWith("MG");
    });
    it("should throw error NOT_FOUND if it's not found in firestore", async () => {
      get.mockReturnValue(undefined);
      getFromFirebase.mockReturnValueOnce(
        Promise.resolve({ exists: false, data })
      );
      const expected = new PurchaseException({
        messageId: MessageIds.NOT_FOUND,
        message: "No data found for UF: [MG]",
      });
      await expect(sut.getWebViewJavascriptByUF("MG")).rejects.toEqual(
        expected
      );
    });
    it("should throw error UNEXPECTED if an exception occurs", async () => {
      const exception = new Error("error");
      const expected = new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: (exception as unknown) as string,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get.mockImplementation((_) => {
        throw exception;
      });
      await expect(sut.getWebViewJavascriptByUF("MG")).rejects.toEqual(
        expected
      );
    });
  });
});
