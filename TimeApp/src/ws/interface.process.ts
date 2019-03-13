import {WsContent} from "./model/content.model";
import {ProcesRs} from "./model/proces.rs";

export interface MQProcess {
  go(content:WsContent,process:ProcesRs):Promise<ProcesRs>
}
