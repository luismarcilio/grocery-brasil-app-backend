import { logger } from "./Logging";

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
    logger.error({messageId: this.messageId, message: this.message, stack: Error().stack});
  }
}

export class PurchaseException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
    logger.error({messageId: this.messageId, message: this.message, stack: Error().stack});
  }
}

export class ProductException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
    logger.error({messageId: this.messageId, message: this.message, stack: Error().stack});
  }
}

export class UserException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
    logger.error({messageId: this.messageId, message: this.message, stack: Error().stack});
  }
}

export class AddressException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
    logger.error({messageId: this.messageId, message: this.message, stack: Error().stack});
  }
}

export class SecretException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
    logger.error({messageId: this.messageId, message: this.message, stack: Error().stack});
  }
}

export class HttpAdapterException implements ApplicationException {
  messageId: MessageIds;
  message: string;

  constructor(builder: { messageId: MessageIds; message: string }) {
    this.messageId = builder.messageId;
    this.message = builder.message;
    logger.error({messageId: this.messageId, message: this.message, stack: Error().stack});
  }
}
