export class BaseService {
  assertNotNumber(src: any, msg: string = "Assert Not Number Error.") {
    if (isNaN(Number(src))) {
      throw new Error(msg);
    }
  }

  assertNumber(src: any, msg: string = "Assert Number Error.") {
    if (!isNaN(Number(src))) {
      throw new Error(msg);
    }
  }

  assertEmpty(src: any, msg: string = "Assert Empty Error.") {
    if (!src) {
      throw new Error(msg);
    }
  }

  assertNotEmpty(src: any, msg: string = "Assert Empty Error.") {
    if (src) {
      throw new Error(msg);
    }
  }

  assertNull(src: any, msg: string = "Assert Null Error.") {
    if (src == null || src == "undefined") {
      throw new Error(msg);
    }
  }

  assertNotNull(src: any, msg: string = "Assert Null Error.") {
    if (src != null && src != "undefined") {
      throw new Error(msg);
    }
  }

  assertFail(msg: string = "Assert Fail Error.") {
    throw new Error(msg);
  }
}

export enum SortType {
  ASC = 'asc',
  DESC = 'desc'
}
