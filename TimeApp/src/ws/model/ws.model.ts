import {WsHeader} from "./header.model";
import {WsContent} from "./content.model";

/**
 * MQ接收数据类
 *
 * create by wzy on 2018/11/28
 */

export class WsModel {
  header:WsHeader;
  original:string;
  content:Map<string,WsContent>;
  context:WsModel;
}
