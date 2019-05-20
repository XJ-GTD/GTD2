import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {WsDataConfig} from "../wsdata.config";

/**
 * 日程修改（获取上下文中） SC
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ContextProcess implements MQProcess{
  constructor() {
  }

  async output(content: WsContent, contextRetMap: Map<string, any>, field: string, default: string, value: any) {
    if (content.output && (content.output[field] || content.output[field] == "")){
      if (content.output[field] != "") {
        if (typeof content.output[field] == "string") {
          contextRetMap.set(content.output[field], value);
        } else {
          // 使用过滤器对值进行转换
          if (content.output[field].name && content.output[field].filter) {
            let filter = eval("(" + content.output[field].filter + ")");
            contextRetMap.set(content.output[field].name, filter(value));
          }
        }
      }
    } else {
      contextRetMap.set(default, value);
    }
  }
  
  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {


    let prv:ProcesRs = content.thisContext.context.client.cxt;
    if (!prv) prv = new ProcesRs();

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let fun = eval("("+content.when+")");
      if (!fun(content,prv.scd,prv.fs)){
        return contextRetMap;
      }
    }

    //服务器要求上下文内放置语音上下文前动作标志
    let prvOpt = content.thisContext.context.client.option;
    output(content, contextRetMap, 'prvoption', WsDataConfig.PRVOPTION, prvOpt);

    //服务器要求上下文内放置语音上下文前process标志
    let prvprocessor = content.thisContext.context.client.processor;
    output(content, contextRetMap, 'prvprocessor', WsDataConfig.PRVPROCESSOR, prvprocessor);

    //服务器要求上下文内放置语音上下文日程
    output(content, contextRetMap, 'agendas', WsDataConfig.SCD, prv.scd);

    //服务器要求上下文内放置日程人员信息
    output(content, contextRetMap, 'contacts', WsDataConfig.FS, prv.fs);

    return contextRetMap
  }

  async go(content: WsContent,processRs:ProcesRs){
      processRs.scd = content.thisContext.context.client.cxt.scd;
      processRs.fs = content.thisContext.context.client.cxt.fs;
      processRs.sucess = true;
      return processRs;
  }
}
