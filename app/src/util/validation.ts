import { ObjectMap } from '../types';

export class ValidationError extends Error {
  public name: string = 'ValidationError';
  public validations: ObjectMap<string>;
  public constructor(validations: ObjectMap<string>) {
    super('Validation error');
    this.validations = validations;
  }
}
