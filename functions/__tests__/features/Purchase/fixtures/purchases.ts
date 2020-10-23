import { Purchase, PurchaseResume } from "../../../../src/model/Purchase";

export const purchase: Purchase = {
  user: {
    userId: "userId",
    email: "teste@teste.com",
    preferences: { searchRadius: 10 },
  },
  fiscalNote: {
    date: new Date(),
    accessKey: "lsdfaslkjfls",
    number: "87687",
    series: "98",
    company: {
      name: "iuoi",
      taxIdentification: "9879",
      address: {
        rawAddress: "kjhkj",
      },
    },
  },
  totalAmount: 10.5,
  purchaseItemList: [
    {
      product: {
        eanCode: "00001",
        name: "product1",
        ncmCode: "00001",
        unity: { name: "UN" },
      },
      unity: { name: "UN" },
      unityValue: 11.5,
      units: 1,
      totalValue: 11.5,
    },
    {
      product: {
        eanCode: "",
        name: "product/2",
        ncmCode: "00002",
        unity: { name: "UN" },
      },
      unity: { name: "UN" },
      unityValue: 12.5,
      units: 1,
      totalValue: 12.5,
    },
  ],
};

export const resume: PurchaseResume = {
  user: purchase.user,
  accessKey: purchase.fiscalNote.accessKey,
  company: purchase.fiscalNote.company,
  date: purchase.fiscalNote.date,
  totalAmount: purchase.totalAmount,
};
