import {WsContent} from "./model/content.model";
import {ProcesRs} from "./model/proces.rs";

export interface MQProcess {
  go(content:WsContent,process:ProcesRs):Promise<ProcesRs>

  gowhen(content:WsContent,process:Map<string,any>):Promise<Map<string,any>>
}
