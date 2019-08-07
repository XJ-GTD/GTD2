export class BaseService {
  assertEmpty(src: any, msg: string = "Assert Empty Error.") {
    if (!src) {
      throw new Error(msg);
    }
  }

  assertNull(src: any, msg: string = "Assert Null Error.") {
    if (src == null || src == "undefined") {
      throw new Error(msg);
    }
  }
}

export enum SortType {
  ASC = 'asc',
  DESC = 'desc'
}
