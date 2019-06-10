import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {PN} from "../model/ws.enum";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {ScudscdPara} from "../model/scudscd.para";
import {NotificationsService} from "../../service/cordova/notifications.service";
import {ScdData} from "../../data.mapping";
import * as moment from "moment";

/**
 * 通知
 *
 * create by xilj on 2019/6/1.
 */
@Injectable()
export class NotificationProcess implements MQProcess {
  constructor(private emitService: EmitService, private busiService: PgBusiService,private notificationsService:NotificationsService) {
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
    if (content.option == PN.DR) {

      //处理所需要参数
      let dailySummary: any = content.parameters;
      let title: string = '每日简报';
      let text: string = '';

      if (dailySummary && dailySummary.timestamp) {
        let day = moment(dailySummary.timestamp);
        text = day.format("M月D日 dddd")
      }

      let data: any = {eventhandler: 'on.dailyreport.message.click', eventdata: dailySummary};

      this.notificationsService.newMessage(title, text, data);
    }

    return contextRetMap
  }

}
