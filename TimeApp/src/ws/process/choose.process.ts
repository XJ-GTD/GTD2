import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {SE} from "../model/ws.enum";
import {DataConfig} from "../../service/config/data.config";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {FsService} from "../../pages/fs/fs.service";
import {FsData, RcInParam, ScdData} from "../../data.mapping";
import {DispatchSubService} from "../dispatchsub.service";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";

/**
 * 选择操作 SE
 *
 * create by xilj on 2019/12/18.
 */
@Injectable()
export class ChooseProcess extends BaseProcess implements MQProcess{
  constructor(dispatchsub: DispatchSubService) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //处理区分
    let opt = content.option;

    //上下文内获取日程查询结果
    let paused: Array<any> = new Array<any>();
    paused = this.input(content, contextRetMap, "paused", WsDataConfig.PAUSED, paused) || paused;

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;

      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,scd,fs,memos,planitems);
      }catch (e){
        rf = false;
      };

      if (!rf){
        return contextRetMap;
      }
    }

    //清空上下文暂停处理缓存
    this.output(content, contextRetMap, 'paused', WsDataConfig.PAUSED, new Array<any>());

    if (opt == SE.DO) {
      contextRetMap = await this.dispatchsub.subprocess(paused, contextRetMap, content.thisContext);
    } else {

    }


    return contextRetMap;
  }

}
