import {WsHeader} from "./header.model";
import {WsContent} from "./content.model";

/**
 * MQ接收数据类
 *
 * create by wzy on 2018/11/28
 */

export class WsModel {
  get content(): Map<string, WsContent> {
    return this._content;
  }

  set content(value: Map<string, WsContent>) {
    this._content = value;
  }
  get header(): WsHeader {
    return this._header;
  }

  set header(value: WsHeader) {
    this._header = value;
  }

  get context(): WsModel {
    return this._context;
  }

  set context(value: WsModel) {
    this._context = value;
  }

  private _header:WsHeader;
  private _content:Map<string,WsContent>;
  private _context:WsModel;


}
