/**
 * @hidden
 * Given a min and max, restrict the given number
 * to the range.
 * @param min the minimum
 * @param n the value
 * @param max the maximum
 */
export function clamp(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

/** @hidden */
export function isBoolean(val: any): val is boolean { return typeof val === 'boolean'; }
/** @hidden */
export function isString(val: any): val is string { return typeof val === 'string'; }
/** @hidden */
export function isNumber(val: any): val is number { return typeof val === 'number'; }
/** @hidden */
export function isFunction(val: any): val is Function { return typeof val === 'function'; }
/** @hidden */
export function isDefined(val: any): boolean { return typeof val !== 'undefined'; }
/** @hidden */
export function isUndefined(val: any): val is undefined { return typeof val === 'undefined'; }
/** @hidden */
export function isPresent(val: any): val is any { return val !== undefined && val !== null; }
/** @hidden */
export function isBlank(val: any): val is null { return val === undefined || val === null; }
/** @hidden */
export function isObject(val: any): val is Object { return typeof val === 'object'; }
/** @hidden */
export function isArray(val: any): val is any[] { return Array.isArray(val); }

/** @hidden */
export function assertNotEqual(src: any, dest: any, msg: string = "Assert Not Equal Error.") {
  if (src !== dest) {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertEqual(src: any, dest: any, msg: string = "Assert Equal Error.") {
  if (src === dest) {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertTrue(src: any, msg: string = "Assert True Error.") {
  if (src) {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertFalse(src: any, msg: string = "Assert False Error.") {
  if (!src) {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertNotNumber(src: any, msg: string = "Assert Not Number Error.") {
  if (isNaN(Number(src))) {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertNumber(src: any, msg: string = "Assert Number Error.") {
  if (!isNaN(Number(src))) {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertEmpty(src: any, msg: string = "Assert Empty Error.") {
  if (!src) {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertNotEmpty(src: any, msg: string = "Assert Empty Error.") {
  if (src) {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertNull(src: any, msg: string = "Assert Null Error.") {
  if (src == null || src == "undefined") {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertNotNull(src: any, msg: string = "Assert Null Error.") {
  if (src != null && src != "undefined") {
    throw new Error(msg);
  }
}

/** @hidden */
export function assertFail(msg: string = "Assert Fail Error.") {
  throw new Error(msg);
}

/** @hidden */
const ASSERT_ENABLED = true;

/** @hidden */
function _assert(actual: any, reason: string) {
  if (!actual && ASSERT_ENABLED === true) {
    let message = 'MWXING ASSERT: ' + reason;
    console.error(message);
    debugger; // tslint:disable-line
    throw new Error(message);
  }
}

/** @hidden */
export { _assert as assert};
