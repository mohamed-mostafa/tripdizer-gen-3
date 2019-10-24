type IResponse = {
  success: boolean;
};

type ISuccessResponse<T> = IResponse & {
  data: T;
};

type IErrorResponse = IResponse & {
  message: string;
};

class Response implements IResponse {
  success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}

export class ErrorResponse extends Response implements IErrorResponse {
  message: string;
  constructor(message: string) {
    super(false);
    this.message = message;
  }
}

export class SuccessResponse<T> extends Response
  implements ISuccessResponse<T> {
  data: T;
  constructor(data: T) {
    super(true);
    this.data = data;
  }
}
