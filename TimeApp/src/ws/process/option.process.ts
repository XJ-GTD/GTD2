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
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content,contextRetMap,"agendas",WsDataConfig.SCD,scd);

    let memos:Array<ScdData> = new Array<ScdData>();
    memos = this.input(content,contextRetMap,"memos",WsDataConfig.MOD,memos);

    let planitems:Array<ScdData> = new Array<ScdData>();
    planitems = this.input(content,contextRetMap,"planitems",WsDataConfig.PID,planitems);

    //上下文内获取日程人员信息
    let fs :Array<FsData> = new Array<FsData>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);


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
    if (opt == O.O){
      contextRetMap = await this.factoryOpt.getOptProcess(prvprocessor).do(content, contextRetMap);

      //取消操作 清除上下文
      DataConfig.clearWsOpts();
      DataConfig.clearWsContext();
      DataConfig.clearWsProcessor();
      DataConfig.clearAIContext = true;

    }else if(opt == O.S){
      //追问操作

    }else{

    }


    return contextRetMap;
  }

}
