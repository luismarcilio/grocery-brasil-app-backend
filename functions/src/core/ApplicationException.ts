export interface ApplicationException {
  messageId: MessageIds;
  message: string;
}
export enum MessageIds {
  UNEXPECTED,
}

export class ScrapNfException implements ApplicationException {
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
