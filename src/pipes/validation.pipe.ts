/* eslint-disable @typescript-eslint/ban-types */
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    console.log(errors);
    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new HttpException('Message', HttpStatus.BAD_REQUEST);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    return errors.reduce((acc, err) => {
      const { property } = err;
      const constraints = Object.values(err.constraints);
      acc[property] = constraints[0];
      return acc;
    }, {});
  }
}
