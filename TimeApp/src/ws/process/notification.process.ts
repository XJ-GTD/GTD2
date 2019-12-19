import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {PN} from "../model/ws.enum";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {ScudscdPara} from "../model/scudscd.para";
import {NotificationsService} from "../../service/cordova/notifications.service";
import {FsData, ScdData} from "../../data.mapping";
import {TellyouType} from "../../data.enum";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import * as moment from "moment";
import {TellyouService} from "../../components/ai/tellyou/tellyou.service";

/**
 * 通知
 *
 * create by xilj on 2019/6/1.
 */
@Injectable()
export class NotificationProcess extends BaseProcess implements MQProcess {
  constructor(private emitService: EmitService, private tellyouService: TellyouService, private notificationsService:NotificationsService) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //上下文内获取暂停缓存
    let paused: Array<any> = new Array<any>();
    paused = this.input(content, contextRetMap, "paused", WsDataConfig.PAUSED, paused) || paused;

    //上下文内获取日程查询结果
    let agendas:Array<ScdData> = new Array<ScdData>();
    agendas = this.input(content,contextRetMap, "agendas", WsDataConfig.SCD, agendas);

    //上下文内获取日程人员信息
    let contacts :Array<FsData> = new Array<FsData>();
    contacts = this.input(content,contextRetMap, "contacts", WsDataConfig.FS, contacts);

    //process处理符合条件则暂停
    if (content.pause && content.pause != "") {
      let pause: boolean = false;

      try {
        let isPause = eval("("+content.pause+")");
        pause = isPause(content, agendas, contacts);
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

      if (exchange.action == "invite") {
        switch (exchange.type) {
          case "Agenda":
            exchange['tellType'] = TellyouType.invite_agenda;
            break;
          case "PlanItem":
            exchange['tellType'] = TellyouType.invite_planitem;
            break;
          default:
            break;
        }
      }

      if (exchange.action == "cancel") {
        switch (exchange.type) {
          case "Agenda":
            exchange['tellType'] = TellyouType.cancel_agenda;
            break;
          case "PlanItem":
            exchange['tellType'] = TellyouType.cancel_planitem;
            break;
          default:
            break;
        }
      }

      if (exchange.action == "annotation") {
        switch (exchange.type) {
          case "Agenda":
            exchange['tellType'] = TellyouType.at_agenda;
            break;
          default:
            break;
        }
      }

      exchange['id'] = exchange.id;
      exchange['idtype'] = exchange.type;

      this.tellyouService.prepare(exchange);
    }

    //提醒消息
    if (content.option == PN.AM) {
      let remind: any = content.parameters;

      switch (remind.type) {
        case "Agenda":
          remind['tellType'] = TellyouType.remind_agenda;
          break;
        case "MiniTask":
          remind['tellType'] = TellyouType.remind_minitask;
          break;
        case "PlanItem":
          remind['tellType'] = TellyouType.remind_planitem;
          break;
        default:
          break;
      }

      if (remind.continue) remind['tellType'] = TellyouType.remind_todo;

      remind['id'] = remind.id;
      remind['idtype'] = remind.type;
      remind['remindtime'] = remind.wd + " " + remind.wt;

      this.tellyouService.tellyou(remind);
    }

    return contextRetMap
  }

}
