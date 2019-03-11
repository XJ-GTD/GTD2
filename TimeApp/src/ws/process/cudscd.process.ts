import {MQProcess} from "./interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";

/**
 * 日历修改处理
 *
 * create by wzy on 2018/11/30.
 */
export class CudscdProcess implements MQProcess{
  constructor(private factory:ProcessFactory,private emitService:EmitService) {
  }


  go(content: WsContent):Promise<WsContent> {
    return new Promise<WsContent>(resolve => {
      //处理区分
      content.option
      //处理所需要参数
      content.parmeter
      //上次处理参数结果
      content.prvData
      //处理结果
      //emit
      this.emitService.emitDatas(content.processRs);
      //判断后处理处理
      content.post
    })
  }

}
