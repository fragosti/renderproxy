import * as R from 'ramda';

export const noop = R.always(undefined);

export const noopAsync = R.always(Promise.resolve());

export const noopAsyncThrow = <T>(): Promise<T> => {
  throw new Error('Function not implemented');
}