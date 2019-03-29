import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {O} from "../model/ws.enum";
import {DataConfig} from "../../service/config/data.config";

/**
 * 确认操作
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class OptionProcess implements MQProcess{
  constructor(private emitService:EmitService) {
  }


  go(content: WsContent,processRs:ProcesRs):Promise<ProcesRs> {
    return new Promise<ProcesRs>(resolve => {
      //处理区分
      let opt = content.option;
      //处理所需要参数
      let cudPara:CudscdPara = content.parameters

      if (opt == O.O){
        //确认操作

      }else if(opt == O.S){
        //追问操作

      }else{
        //取消操作 清除上下文
        DataConfig.clearWsOpts();
        DataConfig.clearWsContext();
      }
    })
  }

}
