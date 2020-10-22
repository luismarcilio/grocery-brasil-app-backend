import * as FirebaseFirestore from "@google-cloud/firestore";

export const firestore: FirebaseFirestore.Firestore = {
  settings: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  collectionGroup: jest.fn(),
  getAll: jest.fn(),
  terminate: jest.fn(),
  listCollections: jest.fn(),
  runTransaction: jest.fn(),
  batch: jest.fn(),
};
