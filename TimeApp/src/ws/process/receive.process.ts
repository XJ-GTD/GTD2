import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {ScudscdPara} from "../model/scudscd.para";

/**
 * 日程修改（获取上下文中）
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ReceiveProcess implements MQProcess{
  constructor(private emitService:EmitService,private busiService:PgBusiService) {
  }


  go(content: WsContent,processRs:ProcesRs):Promise<ProcesRs> {
    return new Promise<ProcesRs>(async resolve => {
      //处理区分
     //content.option
      //处理所需要参数
      let scudPara:ScudscdPara = content.parameters;
      await this.busiService.pullAgd(scudPara.id);
      resolve();
      return;
      //处理结果
      //emit
      //this.emitService.emitDatas(processRs);
    })
  }

}
