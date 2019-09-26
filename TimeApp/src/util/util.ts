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
