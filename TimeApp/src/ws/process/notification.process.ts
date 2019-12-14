import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {PN} from "../model/ws.enum";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {ScudscdPara} from "../model/scudscd.para";
import {NotificationsService} from "../../service/cordova/notifications.service";
import {FsData, ScdData} from "../../data.mapping";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import * as moment from "moment";

/**
 * 通知
 *
 * create by xilj on 2019/6/1.
 */
@Injectable()
export class NotificationProcess extends BaseProcess implements MQProcess {
  constructor(private emitService: EmitService, private busiService: PgBusiService,private notificationsService:NotificationsService) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {
    //上下文内获取日程查询结果
    let agendas:Array<ScdData> = new Array<ScdData>();
    agendas = this.input(content,contextRetMap, "agendas", WsDataConfig.SCD, agendas);

    //上下文内获取日程人员信息
    let contacts :Array<FsData> = new Array<FsData>();
    contacts = this.input(content,contextRetMap, "contacts", WsDataConfig.FS, contacts);

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content, contacts);
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

    //反馈消息
    if (content.option == PN.FB) {
      //处理所需要参数
      let feedback: any = content.parameters;
      let title: string = feedback.title;
      let text: string = feedback.text;

      //参数替换
      if (content.input && content.input.textvariables) {
        for (let txt of content.input.textvariables) {
          let expvalue: string = "";
          if (txt.value || txt.value == "") {
            expvalue = txt.value;
          }else if (txt.expression) {
            try {
              expvalue = eval(txt.expression);
            }catch (e){
              expvalue = txt.default;
            }

            if (!expvalue) {
              expvalue = txt.default;
            }
          } else {
            expvalue = txt.default;
          }

          title = title.replace("{" + txt.name + "}", expvalue);
          text = text.replace("{" + txt.name + "}", expvalue);
        }
      }

      let data: any = {eventhandler: 'on.feedback.message.click', eventdata: feedback};

      //this.notificationsService.newMessage(title, text, data);
    }

    //数据交换消息
    if (content.option == PN.EX) {
      let exchange: any = content.parameters;

      this.emitService.emitAiTellYou({close: false, message: {title:exchange.title,text:exchange.content}});
    }

    //提醒消息
    if (content.option == PN.AM) {
      let remind: any = content.parameters;

      this.emitService.emitAiTellYou({close: false, message: {title:remind.title,text:remind.content}});
    }

    return contextRetMap
  }

}
