import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {O, SS} from "../model/ws.enum";
import {DataConfig} from "../../service/config/data.config";
import {FsData, PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";
import {BsModel} from "../../service/restful/out/bs.model";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {FsService} from "../../pages/fs/fs.service";

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
          let rc : ScdData = new ScdData();
          rc.sn = c.sn;
          rc.sd = c.sd;
          rc.st = c.st;
          rc.si = c.si;

          if (prvOpt == SS.C){
           let bsM:BsModel<CTbl> = await this.busiService.save(rc);
            rc.si = bsM.data.si;
          }else if (prvOpt == SS.U){
            await this.busiService.updateDetail(rc,"1");
          }else{
            await this.busiService.delete( rc.si,"2", rc.sd);
          }

          let pfs:Array<FsData> = new Array<FsData>();
          for(let fs of processRs.fs){
            let p:FsData = new FsData();
            Object.assign(p,fs);
            pfs.push(p);
          }
          this.fsServer.sharefriend(rc.si,pfs);

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
