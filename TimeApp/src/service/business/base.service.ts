import {
  assertNotEqual,
  assertEqual,
  assertTrue,
  assertFalse,
  assertNotNumber,
  assertNumber,
  assertEmpty,
  assertNotEmpty,
  assertNull,
  assertNotNull,
  assertFail
} from "../../util/util";

export class BaseService {
  assertNotEqual(src: any, dest: any, msg: string = "Assert Not Equal Error.") {
    assertNotEqual(src, dest, msg);
  }

  assertEqual(src: any, dest: any, msg: string = "Assert Equal Error.") {
    assertEqual(src, dest, msg);
  }

  assertTrue(src: any, msg: string = "Assert True Error.") {
    assertTrue(src, msg);
  }

  assertFalse(src: any, msg: string = "Assert False Error.") {
    assertFalse(src, msg);
  }

  assertNotNumber(src: any, msg: string = "Assert Not Number Error.") {
    assertNotNumber(src, msg);
  }

  assertNumber(src: any, msg: string = "Assert Number Error.") {
    assertNumber(src, msg);
  }

  assertEmpty(src: any, msg: string = "Assert Empty Error.") {
    assertEmpty(src, msg);
  }

  assertNotEmpty(src: any, msg: string = "Assert Empty Error.") {
    assertNotEmpty(src, msg);
  }

  assertNull(src: any, msg: string = "Assert Null Error.") {
    assertNull(src, msg);
  }

  assertNotNull(src: any, msg: string = "Assert Null Error.") {
    assertNotNull(src, msg);
  }

  assertFail(msg: string = "Assert Fail Error.") {
    assertFail(msg);
  }
}

export enum SortType {
  ASC = 'asc',
  DESC = 'desc'
}
