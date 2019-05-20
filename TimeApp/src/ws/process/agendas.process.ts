import {MQProcess, OptProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {FriendEmData, ScdEmData} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {DataConfig} from "../../service/config/data.config";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {AG, O, SS} from "../model/ws.enum";
import {FsData, RcInParam, ScdData} from "../../data.mapping";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";

/**
 * 日程处理
 *
 * create by zhangjy on 2019/03/28.
 */
@Injectable()
export class AgendasProcess extends BaseProcess implements MQProcess,OptProcess{
  constructor(private busiService:PgBusiService) {
    super();
  }

  async do(content: WsContent, contextRetMap: Map<string,any>) {
    //处理区分
    let opt = content.option;
    //处理所需要参数追问时才需要参数，追问暂时不做
    //let cudPara:CudscdPara = content.parameters;
    let prvOpt:string =  "";
    //获取上下文前动作信息
    prvOpt = this.input(content,contextRetMap,"prvoption",WsDataConfig.PRVOPTION,prvOpt);

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
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

    //确认操作
    for (let c of scd){
      //tx rt
      let rcIn:RcInParam = new RcInParam();
      rcIn.sn = c.sn;
      rcIn.st = c.st;
      rcIn.sd = c.sd;
      if(c.si && c.si != null && c.si != ''){
        rcIn.si = c.si;
      }

      for (let f of  fs){
        rcIn.fss.push(f);
      }

      if (prvOpt == AG.C){
        await this.busiService.saveOrUpdate(rcIn);
      }else if (prvOpt == AG.U){
        await this.busiService.saveOrUpdate(rcIn);
      }else{
        await this.busiService.YuYinDelRc( rcIn.si, rcIn.sd);
      }
    }

    return contextRetMap;
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //记录当前option，为其后动作使用
    contextRetMap.set(WsDataConfig.OPTION4SPEECH, content.option);

    //记录当前processor，为其后动作使用
    contextRetMap.set(WsDataConfig.PROCESSOR4SPEECH, content.processor);

    //处理所需要参数
    let cudPara:CudscdPara = content.parameters;
    //处理结果
    let prv : ProcesRs = new ProcesRs();

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content,contextRetMap,"agendas",WsDataConfig.SCD,scd);

    //上下文内获取查询条件用日程人员或创建的日程人员
    let fs :Array<FsData> = new Array<FsData>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let fun = eval("("+content.when+")");
      if (!fun(content,scd,fs)){
        return contextRetMap;
      }
    }

    //处理区分
    // 创建日程
    if (content.option == AG.C) {
      if (fs.length > 0){
        prv.fs = fs;
      }

      // F处理返回的结果
      if (scd.length > 0){
      }

      // 查询没有日程
      // 查询有日程
      let c:ScdData = new ScdData();
      prv.scd.push(c);

      for (let c of prv.scd){
        c.sd = cudPara.d == null?c.sd:cudPara.d;
        c.sn = cudPara.ti == null?c.sn:cudPara.ti;
        c.st = cudPara.t == null?c.st:cudPara.t;
        //显示本次创建的人
        c.fss = fs;
      }
    }

    // 修改日程
    if (content.option == AG.U) {

      if (prv.scd.length == 1) {
        if (scd[0].gs != "0" && (scd[0].sd != cudPara.d || scd[0].sn != cudPara.ti ||
            scd[0].st != cudPara.t  )) {
          //出错记录
          this.output(content, contextRetMap, 'branchcode', WsDataConfig.BRANCHCODE, "E");

          //出错记录
          this.output(content, contextRetMap, 'branchtype', WsDataConfig.BRANCHTYPE, "NODO");

          //上下文内放置创建的或修改的日程更新内容
          this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, new Array<ScdData>());

          //上下文内放置创建的或修改的日程联系人
          this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, new Array<FsData>());

          return contextRetMap;
        }

      }

      if (fs.length > 0){
        prv.fs = fs;
      }

      // F处理返回的结果
      if (scd.length > 0){
        prv.scd = scd;
      }

      // 查询没有日程
      if (prv.scd.length == 0){}
      // 查询有1个日程
      if (prv.scd.length == 1){
        // 设置修改后内容
        for (let c of prv.scd){
          c.sd = (cudPara.d == null || cudPara.d == '')? c.sd:cudPara.d;
          c.sn = (cudPara.ti == null || cudPara.ti == '')?c.sn:cudPara.ti;
          c.st = (cudPara.t == null || cudPara.t == '')?c.st:cudPara.t;
          //显示本次添加的人
          c.fss = fs;
        }
      }
      // 查询有1个被共享日程
      if (prv.scd.length == 1){}
      // 查询有多个日程
      if (prv.scd.length > 1){}
    }

    // 删除日程
    if (content.option == AG.D) {
      if (fs.length > 0){
        prv.fs = fs;
      }

      // F处理返回的结果
      if (scd.length > 0){
        prv.scd = scd;
      }

      // 查询没有日程
      if (prv.scd.length == 0){}
      // 查询有1个日程
      if (prv.scd.length == 1){
        for (let c of prv.scd) {
          c.fss = fs;
        }
      }
      // 查询有多个日程
      if (prv.scd.length > 1){}
    }

    //TODO 缺少元素提醒
    //处理区分
    // content.option
    //  "检查日程缺失项目
    //  检查内容（日期，时间，主题）（提示缺少元素）"	AG.C
    //
    //  "修改时候检查
    //  是否被共享(提示不能修改)
    //  是否重复日程提醒（提示更新今天，还是以后）"	AG.U
    //  删除日程	AG.D


    //上下文内放置创建的或修改的日程更新内容
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, prv.scd);

    //上下文内放置创建的或修改的日程联系人
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, prv.fs);

    return contextRetMap;
  }

}
