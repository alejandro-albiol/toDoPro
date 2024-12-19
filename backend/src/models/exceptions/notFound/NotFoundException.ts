import { BaseException } from '../base/BaseException.js';

export class NotFoundException extends BaseException {
  constructor(entity: string, id: string) {
    super(
      `${entity} with id ${id} not found`,
      404,
      `${entity.toUpperCase()}_NOT_FOUND`,
    );
  }
}
