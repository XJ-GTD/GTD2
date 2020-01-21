import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {SH} from "../model/ws.enum";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ScudscdPara} from "../model/scudscd.para";
import {NotificationsService} from "../../service/cordova/notifications.service";
import {ScdData} from "../../data.mapping";

/**
 * 日程修改（获取上下文中）
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ReceiveProcess implements MQProcess {
  constructor(private emitService: EmitService, private notificationsService:NotificationsService) {
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

    //处理区分
    if (content.option == SH.D) {
      //处理所需要参数
      let scudPara: ScudscdPara = content.parameters;

      // await this.busiService.pullDel(scudPara.id);
    }

    if (content.option == SH.C || content.option == SH.U) {
      //处理所需要参数
      let scudPara: ScudscdPara = content.parameters;

      let scd:ScdData = new ScdData();
      // scd = await this.busiService.pullAgd(scudPara.id);

      if (scd != null){
        this.emitService.emit("on.agendashare.saved", scd);
        //消息提醒统一使用极光推送
        //this.notificationsService.newSms(scd);
      }

    }

    return contextRetMap
  }

}
