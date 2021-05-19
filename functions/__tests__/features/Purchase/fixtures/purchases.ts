import { Purchase, PurchaseResume } from "../../../../src/model/Purchase";

export const purchase: Purchase = {
  user: {
    address: { rawAddress: "rawAddress" },
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
        location: {
          lat: -22.9745891,
          lon: -43.199457,
          geohash: {
            g1: "7",
            g2: "75",
            g3: "75c",
            g4: "75cm",
            g5: "75cm2",
            g6: "75cm2c",
            g7: "75cm2cx",
            g8: "75cm2cxc",
            g9: "75cm2cxc4",
          },
        },
      },
    },
  },
  totalAmount: 10.5,
  totalDiscount: 3,
  purchaseItemList: [
    {
      product: {
        productId: "00001",
        eanCode: "00001",
        name: "product1",
        ncmCode: "00001",
        unity: { name: "UN" },
      },
      unity: { name: "UN" },
      unityValue: 11.5,
      units: 1,
      totalValue: 11.5,
      discount: 1
    },
    {
      product: {
        productId: "00002-product-2",
        eanCode: "",
        name: "product/2",
        ncmCode: "00002",
        unity: { name: "UN" },
      },
      unity: { name: "UN" },
      unityValue: 12.5,
      units: 1,
      totalValue: 12.5,
      discount: 2
    },
  ],
};

export const resume: PurchaseResume = {
  user: purchase.user,
  accessKey: purchase.fiscalNote.accessKey,
  company: purchase.fiscalNote.company,
  date: purchase.fiscalNote.date,
  totalAmount: purchase.totalAmount,
  totalDiscount: purchase.totalDiscount
};
