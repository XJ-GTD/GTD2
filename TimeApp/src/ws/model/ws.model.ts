import {WsHeader} from "./header.model";
import {WsContent} from "./content.model";
import * as moment from "moment";
import {ProcesRs} from "./proces.rs";

/**
 * MQ接收数据类
 *
 * create by wzy on 2018/11/28
 */

export class WsModel {
  header:WsHeader;
  original:string;
  content:Map<string,WsContent>;
  context:ContextModel;
}

export class ContextModel {
  client = {time: moment().unix(),
            serverratio: 0,
            ratios: new Array<any>(),
            cxt: new Array<ProcesRs>() ,
            option:new Array<string>(),
            processor:new Array<string>()};
  server = {};
}
