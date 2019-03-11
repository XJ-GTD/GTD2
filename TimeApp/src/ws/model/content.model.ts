/**
 * MQ接收数据content
 *
 * create by wzy on 2018/11/28
 */
export class WsContent {
  get processRs(): any {
    return this._processRs;
  }

  set processRs(value: any) {
    this._processRs = value;
  }

  get prvData(): WsContent {
    return this._prvData;
  }

  set prvData(value: WsContent) {
    this._prvData = value;
  }
  get option(): string {
    return this._option;
  }

  set option(value: string) {
    this._option = value;
  }

  get parmeter(): Array<Map<string, string>> {
    return this._parmeter;
  }

  set parmeter(value: Array<Map<string, string>>) {
    this._parmeter = value;
  }

  get post(): WsContent {
    return this._post;
  }

  set post(value: WsContent) {
    this._post = value;
  }
  private _option: string = "";
  private _parmeter: Array<Map<string, string>> = [];
  private _post: WsContent;
  private _processRs:any;
  private _prvData:WsContent;
}

