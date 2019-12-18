import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {MK} from "../model/ws.enum";
import {Injectable} from "@angular/core";
import {EventService, MarkupData} from "../../service/business/event.service";
import {MarkupPara} from "../model/markup.para";

/**
 * 标注日程语义标签
 *
 * create by xilj on 2019/05/28.
 */
@Injectable()
export class MarkupProcess implements MQProcess {
  constructor(private eventService: EventService) {
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //process处理符合条件则暂停
    if (content.pause && content.pause != "") {
      let pause: boolean = false;

      try {
        let isPause = eval("("+content.pause+")");
        pause = isPause(content);
      } catch (e) {
        pause = false;
      }

      if (pause) {
        let pausedContent: any = {};
        Object.assign(pausedContent, content);
        delete pausedContent.thisContext;

        paused.push(pausedContent);

        //设置上下文暂停处理缓存
        this.output(content, contextRetMap, 'paused', WsDataConfig.PAUSED, paused);

        return contextRetMap;
      }
    }

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
        let markup: MarkupData = {} as MarkupData;
        markup.obi = mk.id;
        markup.mkl = mk.mkl;
        markup.mkt = mk.mkt;

        await this.eventService.saveMarkup(markup);
      }
    }

    return contextRetMap;
  }
}
