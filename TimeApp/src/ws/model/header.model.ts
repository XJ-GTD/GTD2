/**
 * MQ接收数据header
 *
 * create by wzy on 2018/11/28
 */
export class WsHeader{
  private _version:string = "";
  private _sender:string = "";
  private _datetime:string="";
  private _describe:Array<string>=[];

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  get sender(): string {
    return this._sender;
  }

  set sender(value: string) {
    this._sender = value;
  }

  get datetime(): string {
    return this._datetime;
  }

  set datetime(value: string) {
    this._datetime = value;
  }

  get describe(): Array<string> {
    return this._describe;
  }

  set describe(value: Array<string>) {
    this._describe = value;
  }
}

