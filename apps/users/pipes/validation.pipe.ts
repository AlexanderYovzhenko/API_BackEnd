import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from './validation.exception';
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value); //объект валидации-тело запроса
    const errors = await validate(obj); //ошибки валидации

    if (errors.length) {
      const messages = errors.map((err) => {
        return `${err.property /*название поля из дто*/} - ${Object.values(
          err.constraints,
        ).join(',')}`;
      });
      throw new ValidationException(messages);
    }
    return value;
  }
}
