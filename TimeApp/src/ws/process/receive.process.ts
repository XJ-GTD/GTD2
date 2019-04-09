import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";
import {ScudscdPara} from "../model/scudscd.para";
import {NotificationsService} from "../../service/cordova/notifications.service";
import {AgdPro} from "../../service/restful/agdsev";

/**
 * 日程修改（获取上下文中）
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ReceiveProcess implements MQProcess {
  constructor(private emitService: EmitService, private busiService: PgBusiService,private notificationsService:NotificationsService) {
  }


  async go(content: WsContent, processRs: ProcesRs) {
    //处理区分
    //content.option
    //处理所需要参数
    let scudPara: ScudscdPara = content.parameters;
    processRs.option4Speech = content.option;
    let agd:AgdPro = await this.busiService.pullAgd(scudPara.id);

    // TODO 需要处理消息提醒接收日程
    let scd:ScdData = new ScdData();
    
    scd.sn = agd.at;
    
    this.notificationsService.newSms(scd);
    return processRs;
    //处理结果
    //emit
    //this.emitService.emitDatas(processRs);
  }

}
