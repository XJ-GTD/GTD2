/**
 * MQ接收数据content
 *
 * create by wzy on 2018/11/28
 */
import {WsModel} from "./ws.model";

export class WsContent {
  processor:string ="";
  option: string = "";
  parameters: any;
  thisContext:WsModel;
  when:string ="";
  input:any;
  output:any;
}

