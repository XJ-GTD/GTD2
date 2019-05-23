import {WsContent} from "./model/content.model";
import {ProcesRs} from "./model/proces.rs";

export interface MQProcess {

  //准备
  gowhen(content:WsContent,contextRetMap:Map<string,any>):Promise<Map<string,any>>
}

export interface OptProcess {

  //执行
  do(content:WsContent,contextRetMap:Map<string,any>):Promise<Map<string,any>>
}
