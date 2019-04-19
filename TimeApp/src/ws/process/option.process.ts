import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {O, SS} from "../model/ws.enum";
import {DataConfig} from "../../service/config/data.config";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {FsService} from "../../pages/fs/fs.service";
import {ScdData} from "../../data.mapping";

/**
 * 确认操作
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class OptionProcess implements MQProcess{
  constructor(private emitService:EmitService,private busiService:PgBusiService,private fsServer:FsService) {
  }


  async go(content: WsContent,processRs:ProcesRs) {
      //处理区分
      let opt = content.option;
      //处理所需要参数追问时才需要参数，追问暂时不做
      //let cudPara:CudscdPara = content.parameters;
      let prvOpt:string =  content.thisContext.context.client.option;

      if (opt == O.O){
        //确认操作
        for (let c of processRs.scd){
          //tx rt
          let dbscd:ScdData = new ScdData();
          dbscd.sn = c.sn;
          dbscd.st = c.st;
          dbscd.sd = c.sd;
          dbscd.si = c.si;
          dbscd.gs = "0";
          dbscd.du = "1";
          dbscd.tx = "0";
          dbscd.rt = "0";

          for (let f of processRs.fs){
            dbscd.fss.push(f);
          }

          if (prvOpt == SS.C){
           await this.busiService.save4ai(dbscd);
          }else if (prvOpt == SS.U){
            //TODO 需要修改update 方法
            await this.busiService.updateDetail(dbscd);
          }else{
            //TODO 需要修改delete 方法
            await this.busiService.delete( dbscd.si,"2", dbscd.sd);
          }
        }

      }else if(opt == O.S){
        //追问操作

      }else{
        //取消操作 清除上下文
        DataConfig.clearWsOpts();
        DataConfig.clearWsContext();
      }

      processRs.option4Speech = content.option;
      processRs.sucess = true;
      return processRs;
  }

}
