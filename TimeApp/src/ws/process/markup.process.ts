import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {MK} from "../model/ws.enum";
import {Injectable} from "@angular/core";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";

/**
 * 标注日程语义标签
 *
 * create by xilj on 2019/05/28.
 */
@Injectable()
export class MarkupProcess implements MQProcess {
  constructor(private busiService: PgBusiService) {
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {
    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content);
      }catch (e){
        rf = false;
      };
      if (!rf){
        return contextRetMap;
      }
    }

  }
}
