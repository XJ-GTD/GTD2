import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {SD} from "../model/ws.enum";
import {Injectable} from "@angular/core";
import {CalendarService, PlanItemData} from "../../service/business/calendar.service";
import {SpecialDataPara} from "../model/specialdata.para";
import {RcInParam} from "../../data.mapping";
import {BaseProcess} from "./base.process";
import {EmitService} from "../../service/util-service/emit.service";
import * as moment from "moment";
import { PlanItemType, SelfDefineType, DelType } from "../../data.enum";

/**
 * 特殊数据接收
 *
 * create by xilj on 2019/06/16.
 */
@Injectable()
export class SpecialDataProcess extends BaseProcess implements MQProcess {
  constructor(private calendarService: CalendarService,
              private emitService: EmitService) {
    super();
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
    let specialDataPara: SpecialDataPara = content.parameters;

    if (specialDataPara.datas && specialDataPara.datas.length > 0) {

      let hasWeather: boolean = false;

      for (let data of specialDataPara.datas) {
        if (data.type == "weather") {
          hasWeather = true;
        }

        let current: PlanItemData = {} as PlanItemData;

        current.jtt = PlanItemType.Weather;
        current.jtc = SelfDefineType.System;
        current.sd = data.fordate;
        current.del = DelType.undel;

        current = await this.calendarService.findPlanItem(current) || current;

        if (current && current.jti) {
          let origin: PlanItemData = {} as PlanItemData;
          Object.assign(origin, current);

          current.jtn = data.title;
          current.st = moment().format("HH:mm");
          current.ji = "";
          current.bz = data.desc;
          current.ext = JSON.stringify(data.ext).replace(/\"/g, `""`);

          await this.calendarService.savePlanItem(current, origin);
        } else {
          current.jtn = data.title;
          current.st = moment().format("HH:mm");
          current.ji = "";
          current.bz = data.desc;
          current.ext = JSON.stringify(data.ext).replace(/\"/g, `""`);

          await this.calendarService.savePlanItem(current);
        }
      }

      if (hasWeather) this.emitService.emit("mwxing.weather.received");
    }

    return contextRetMap;
  }
}
