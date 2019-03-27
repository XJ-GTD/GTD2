import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";

/**
 * 日程修改（获取上下文中）
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ReceiveProcess implements MQProcess{
  constructor(private emitService:EmitService) {
  }


  go(content: WsContent,processRs:ProcesRs):Promise<ProcesRs> {
    return new Promise<ProcesRs>(resolve => {
      //处理区分
      content.option
      //处理所需要参数
      let cudPara:CudscdPara = content.parameters;
      //处理结果
      //emit
      //this.emitService.emitDatas(processRs);
    })
  }

}
