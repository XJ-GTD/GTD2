import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";

/**
 * 日程修改（获取上下文中） SC
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ContextProcess implements MQProcess{
  constructor() {
  }


  go(content: WsContent,processRs:ProcesRs):Promise<ProcesRs> {
    return new Promise<ProcesRs>(resolve => {
      processRs.scd = content.thisContext.context.client.cxt.scd;
      processRs.fs = content.thisContext.context.client.cxt.fs;
      processRs.sucess = true;
      resolve(processRs);
      return;
    })
  }
}
