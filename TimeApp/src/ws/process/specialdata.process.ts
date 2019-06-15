import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {SD} from "../model/ws.enum";
import {Injectable} from "@angular/core";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {SpecialDataPara} from "../model/specialdata.para";
import {RcInParam} from "../../data.mapping";
import {BaseProcess} from "./base.process";

/**
 * 标注日程语义标签
 *
 * create by xilj on 2019/05/28.
 */
@Injectable()
export class SpecialDataProcess extends BaseProcess implements MQProcess {
  constructor(private busiService: PgBusiService) {
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
      for (let data of specialDataPara.datas) {
        let rcArray: Array<RcInParam> = new Array<RcInParam>();

        for (let data of datas) {
          let rc:RcInParam = new RcInParam();

          rc.sn = data.title;//日程事件主题  必传
          rc.sd = data.atdate;//开始日期      必传
          rc.st = "99:99";//开始时间
          rc.ji = "";//计划ID
          rc.bz = data.desc;//备注
          rc.gs = (data.type == "weather"? "6" : "6");

          rcArray.push(rc);
        }

        await this.busiService.saveBatch(rcArray);
      }
    }

    return contextRetMap;
  }
}
