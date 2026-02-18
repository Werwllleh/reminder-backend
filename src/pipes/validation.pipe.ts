import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  private toValidate(metatype?: Function): boolean {
    if (!metatype) return false;

    // пропускаем встроенные типы
    const types: Function[] = [String, Boolean, Number, Array, Object];
    if (types.includes(metatype)) return false;

    // ✅ пропускаем всё, что не похоже на класс DTO
    // (у DTO обычно есть prototype и имя)
    if (!metatype.prototype) return false;

    return true;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype, type } = metadata;

    // ✅ валидируем ТОЛЬКО body
    if (type !== 'body') return value;

    if (!this.toValidate(metatype)) return value;

    const obj = plainToInstance(metatype as ClassConstructor<any>, value);

    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.flatMap(err =>
        err.constraints ? Object.values(err.constraints).map(m => `${err.property} - ${m}`) : [],
      );
      throw new ValidationException(messages.length ? messages : ['Некорректные данные']);
    }

    return value;
  }
}
