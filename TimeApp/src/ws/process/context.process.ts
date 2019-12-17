import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {DataConfig} from "../../service/config/data.config";

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

    DataConfig.wsContext = content.thisContext.context.client.cxt;
    let prv :ProcesRs = new ProcesRs();
    if (DataConfig.wsContext && DataConfig.wsContext.length >0 ){
      prv = DataConfig.wsContext.splice(DataConfig.wsContext.length - 1,1 )[0];
    }


    //process处理符合条件则执行
    if (content.when && content.when !=""){
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
    DataConfig.wsWsOpt = content.thisContext.context.client.option;
    let prvOpt :string  = "";
    if (DataConfig.wsWsOpt && DataConfig.wsWsOpt.length >0 ){
      prvOpt = DataConfig.wsWsOpt.splice(DataConfig.wsWsOpt.length - 1,1 )[0];
    }
    this.output(content, contextRetMap, 'prvoption', WsDataConfig.PRVOPTION, prvOpt);

    //服务器要求上下文内放置语音上下文前process标志
    DataConfig.wsWsProcessor = content.thisContext.context.client.processor;
    let prvprocessor :string  = "";
    if (DataConfig.wsWsProcessor && DataConfig.wsWsProcessor.length >0 ){
      prvprocessor = DataConfig.wsWsProcessor.splice(DataConfig.wsWsProcessor.length - 1,1 )[0];
    }
    this.output(content, contextRetMap, 'prvprocessor', WsDataConfig.PRVPROCESSOR, prvprocessor);

    //服务器要求上下文内放置语音上下文日程
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, prv.scd);

    //服务器要求上下文内放置语音上下文日程
    this.output(content, contextRetMap, 'memos', WsDataConfig.MOD, prv.mod);

    //服务器要求上下文内放置语音上下文日程
    this.output(content, contextRetMap, 'planitems', WsDataConfig.pid, prv.pid);

    //服务器要求上下文内放置日程人员信息
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, prv.fs);

    return contextRetMap
  }
}
