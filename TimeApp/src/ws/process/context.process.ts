import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";

/**
 * 日程修改（获取上下文中） SC
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ContextProcess extends BaseProcess implements MQProcess{
  constructor() {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    console.log("******************sc gowhen start")
    let prv:ProcesRs = content.thisContext.context.client.cxt;
    if (!prv) prv = new ProcesRs();

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      console.log("******************sc gowhen content.when" +content.when)
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,prv.scd,prv.fs);
      }catch (e){
        rf = false;
      }
      if (!rf){
        return contextRetMap;
      }
    }

    //服务器要求上下文内放置语音上下文前动作标志
    let prvOpt = content.thisContext.context.client.option;
    this.output(content, contextRetMap, 'prvoption', WsDataConfig.PRVOPTION, prvOpt);

    //服务器要求上下文内放置语音上下文前process标志
    let prvprocessor = content.thisContext.context.client.processor;
    this.output(content, contextRetMap, 'prvprocessor', WsDataConfig.PRVPROCESSOR, prvprocessor);

    //服务器要求上下文内放置语音上下文日程
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, prv.scd);

    //服务器要求上下文内放置日程人员信息
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, prv.fs);
    console.log("******************sc gowhen end" )
    return contextRetMap
  }

  async go(content: WsContent,processRs:ProcesRs){
      processRs.scd = content.thisContext.context.client.cxt.scd;
      processRs.fs = content.thisContext.context.client.cxt.fs;
      processRs.sucess = true;
      return processRs;
  }
}
