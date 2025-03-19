import { HttpException, HttpStatus } from '@nestjs/common';

interface IFieldError {
  field: string;
  errorMessage: string;
}

export class FormFieldError extends HttpException {
  public fields: IFieldError[];

  constructor(message: string = 'Form has errors', fields: IFieldError[]) {
    super(message, HttpStatus.BAD_REQUEST);
    this.fields = fields;
  }
}

export class AuthorizationError extends HttpException {
  constructor() {
    super(
      'You sir, are unauthorized. Please leave or face the consequences',
      HttpStatus.UNAUTHORIZED,
    );

    console.log('Cause:', this.cause);
    console.log('Response:', this.getResponse());
    console.log('Status:', this.getStatus());
    console.log('initCause:', this.initCause());
    console.log('initMessage:', this.initMessage());
    console.log('message:', this.message);
    console.log('name:', this.name);
    console.log('stack:', this.stack);
  }
}

export class ServerError extends HttpException {
  constructor(
    message: string = 'A Server Error Has Occured. Please Try Again Later',
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UserNotFoundError extends HttpException {
  constructor(message: string = 'The Thing You Looking For is Not Found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class NotFound extends HttpException {
  constructor(message: string = 'The Thing You Are Looking For Is Not Found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class HasActiveNeedGroupError extends Error {
  constructor() {
    super('The Child has Active Needs. You Cannot Create New Need Group');
  }
}

export class HasNoActiveNeedGroupError extends HttpException {
  constructor() {
    super(
      'The child has no active group. Please create it first',
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}

export class IsNotActiveGroup extends Error {
  constructor(message: string = 'The Need Group is Not Active') {
    super(message);
  }
}

export class EmptyData extends HttpException {
  constructor(message: string = 'Data is Empty') {
    super(message, HttpStatus.NO_CONTENT);
  }
}

export class AlreadyHave extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class BadRequestError extends HttpException {
  constructor(message: string = 'Invalid Request Data') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class NotSponsoredError extends HttpException {
  constructor() {
    super('You are not sponsored to this user', HttpStatus.BAD_REQUEST);
  }
}
