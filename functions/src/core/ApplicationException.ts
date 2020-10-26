export interface ApplicationException {
  messageId: MessageIds;
  message?: string;
}
export enum MessageIds {
  UNEXPECTED,
  UNIMPLEMENTED,
  INVALID_ARGUMENT,
  NOT_FOUND,
}

export class ScrapNfException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
  }
}

export class PurchaseException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
  }
}

export class ProductException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
  }
}

export class UserException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
  }
}

export class AddressException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
  }
}

export class SecretException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
  }
}
