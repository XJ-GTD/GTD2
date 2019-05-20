import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {O, SS} from "../model/ws.enum";
import {DataConfig} from "../../service/config/data.config";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {FsService} from "../../pages/fs/fs.service";
import {FsData, RcInParam, ScdData} from "../../data.mapping";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {OptProcessFactory} from "../optprocess.factory";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";

/**
 * 确认操作
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class OptionProcess extends BaseProcess implements MQProcess{
  constructor(private emitService:EmitService,private busiService:PgBusiService,
              private fsServer:FsService,private factoryOpt: OptProcessFactory,) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {


    //处理区分
    let opt = content.option;
    //处理所需要参数追问时才需要参数，追问暂时不做
    //let cudPara:CudscdPara = content.parameters;


    //获取上下文前动作信息
    let prvOpt:string =  "";
    prvOpt = this.input(content,contextRetMap,"prvoption",WsDataConfig.PRVOPTION,prvOpt);


    //获取上下文前动作信息
    let prvprocessor:string =  "";
    prvprocessor = this.input(content,contextRetMap,"prvprocessor",WsDataConfig.PRVPROCESSOR,prvprocessor);


    //上下文内获取日程查询结果
    let scd:Array<CTbl> = new Array<CTbl>();
    scd = this.input(content,contextRetMap,"agendas",WsDataConfig.SCD,scd);


    //上下文内获取日程人员信息
    let fs :Array<FsData> = new Array<FsData>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);


    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let fun = eval("("+content.when+")");
      if (!fun(content,scd,fs)){
        return contextRetMap;
      }
    }

    if (opt == O.O){
      contextRetMap = await this.factoryOpt.getOptProcess(prvprocessor).do(content, contextRetMap);
      //取消操作 清除上下文
      DataConfig.clearWsOpts();
      DataConfig.clearWsContext();
      DataConfig.clearWsProcessor();

    }else if(opt == O.S){
      //追问操作

    }else{

    }


    return contextRetMap;
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
          let rcIn:RcInParam = new RcInParam();
          rcIn.sn = c.sn;
          rcIn.st = c.st;
          rcIn.sd = c.sd;
          if(c.si && c.si != null && c.si != ''){
            rcIn.si = c.si;
          }

          for (let f of  processRs.fs){
            rcIn.fss.push(f);
          }

          if (prvOpt == SS.C){
              await this.busiService.saveOrUpdate(rcIn);
          }else if (prvOpt == SS.U){
            await this.busiService.saveOrUpdate(rcIn);
          }else{
            await this.busiService.YuYinDelRc( rcIn.si, rcIn.sd);
          }
        }
        //取消操作 清除上下文
        DataConfig.clearWsOpts();
        DataConfig.clearWsContext();

      }else if(opt == O.S){
        //追问操作

      }else{

      }

      processRs.option4Speech = content.option;
      processRs.sucess = true;
      return processRs;
  }

}
