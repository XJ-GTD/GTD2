import {WsContent} from "../model/content.model";

export interface MQProcess {
  go(content:WsContent):Promise<any>
}
