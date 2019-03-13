import {WsContent} from "../model/content.model";
import {MQProcess} from "../interface.process";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ThirdProcess implements MQProcess {
  constructor() {
  }

  go(content: WsContent, procesRs: ProcesRs): Promise<ProcesRs> {
    return new Promise<ProcesRs>(resolve => {

      //处理区分
      content.option
      //处理所需要参数
      content.parmeter
    })
  }

}
