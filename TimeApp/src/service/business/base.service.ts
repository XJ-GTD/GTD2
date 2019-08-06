export class BaseService {
  assertEmpty(src: any, msg: string = "Assert Empty Error.") {
    if (!src) {
      throw new Error(msg);
    }
  }
}
