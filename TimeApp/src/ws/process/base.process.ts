import {WsContent} from "../model/content.model";
import {MQProcess} from "../interface.process";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {WsDataConfig} from "../wsdata.config";

/**
 * process基类
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class BaseProcess {
  constructor() {
  }

  output(content: WsContent, contextRetMap: Map<string, any>, field: string,
         defaultname: string, value: any) {
    if (content.output && (content.output[field] || content.output[field] == "")){
      if (content.output[field] != "") {
        if (typeof content.output[field] == "string") {
          contextRetMap.set(content.output[field], value);
        } else {
          // 使用过滤器对值进行转换
          if (content.output[field].name && content.output[field].filter) {
            try{
              let filter = eval("(" + content.output[field].filter + ")");
              contextRetMap.set(content.output[field].name, filter(value));
            }catch (e){
              contextRetMap.set(content.output[field].name, value);
            }
          }
        }
      }
    } else {
      contextRetMap.set(defaultname, value);
    }
  }

  input(content: WsContent, contextRetMap: Map<string, any>,
        field: string, defaultname: string, fieldobject :any):any {

    if (content.input && (content.input[field] ||content.input[field] == "")){
      if (content.input[field] != "") fieldobject = contextRetMap.get(content.input[field]);
    } else {
      fieldobject = contextRetMap.get(defaultname);
    }
    return fieldobject;
  }

}
