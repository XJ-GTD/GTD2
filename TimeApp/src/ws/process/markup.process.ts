import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {MK} from "../model/ws.enum";
import {Injectable} from "@angular/core";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {MarkupPara} from "../model/markup.para";

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

    //处理所需要参数
    let markupPara: MarkupPara = content.parameters;

    if (markupPara.mks && markupPara.mks.length > 0) {
      for (let mk of markupPara.mks) {
        await this.busiService.markup(mk.id, mk.mkl, mk.mkt);
      }
    }

    return contextRetMap;
  }
}
