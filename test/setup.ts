import _ from 'underscore';
import { expect } from 'vitest';

interface Options {
  allowEmpty?: boolean;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeArray(): R;
      toBeArrayOf(type: any, options?: Options): R;
      toBeArrayOfValues(values: any, options?: Options): R;
      toBeBoolean(): R;
      toBeObject(): R;
      toBeString(): R;
    }
  }
}

expect.extend({
  toBeArray: (received) => {
    const pass = _.isArray(received) && !_.isEmpty(received);

    return {
      message: pass ? undefined : () => `expected ${received} to be an array`,
      pass,
    };
  },
  toBeArrayOf: (received, type, { allowEmpty } = { allowEmpty: true }) => {
    const pass = (allowEmpty && !received) ||
      (_.isArray(received) && _.every(received, (item: any) => item.constructor.name === type.name));

    return {
      message: pass ? undefined : () => `expected ${received} to be an array containing ${type}`,
      pass
    };
  },
  toBeArrayOfValues: (received, values, { allowEmpty} = { allowEmpty: true }) => {
    const pass = (allowEmpty && !received) ||
      (_.isArray(received) && _.every(received, (item: any) => _.contains(values, item)));

    return {
      message: pass ? undefined : () => `expected ${received} to be an array containing ${values.join(',')}`,
      pass
    };
  },
  toBeBoolean: (received) => {
    const pass = _.isUndefined(received) || _.isBoolean(received);

    return {
      message: pass ? undefined : () => `expected ${received} to be a boolean`,
      pass
    };
  },
  toBeObject: (received) => {
    const pass = _.isObject(received) && !_.isArray(received) && !_.isFunction(received) && !_.isEmpty(received);

    return {
      message: pass ? undefined : () => `expected ${received} to be an object`,
      pass
    };
  },
  toBeString: (received) => {
    const pass = _.isString(received) && !_.isEmpty(received);

    return {
      message: pass ? undefined : () => `expected ${received} to be a non-empty string`,
      pass
    };
  }
});