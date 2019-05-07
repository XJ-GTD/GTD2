import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {FriendEmData, ScdEmData} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {DataConfig} from "../../service/config/data.config";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";

/**
 * 日历修改处理
 *
 * create by zhangjy on 2019/03/28.
 */
@Injectable()
export class CudscdProcess implements MQProcess{
  constructor() {
  }


  async go(content: WsContent,processRs:ProcesRs) {

      //处理所需要参数
      let cudPara:CudscdPara = content.parameters;
      //处理结果
      //emit
      let prv:ProcesRs = content.thisContext.context.client.cxt;
      if (!prv) prv = processRs;

      if (processRs.fs.length > 0){
        prv.fs = processRs.fs;
      }
      
      // F处理返回的结果
      if (processRs.scd.length > 0){

        prv.scd = processRs.scd;
      }


      //处理区分
      // 创建日程
      if (content.option == SS.C) {
        // 查询没有日程
        // 查询有日程
      }

      // 修改日程
      if (content.option == SS.U) {
        // 查询没有日程
        // 查询有1个日程
        // 查询有1个被共享日程
        // 查询有多个日程
      }

      // 删除日程
      if (content.option == SS.D) {
        // 查询没有日程
        // 查询有1个日程
        // 查询有多个日程
      }
      
      if (prv.scd.length == 0){
        let ctbl:CTbl = new CTbl();
        prv.scd.push(ctbl);
      }

      for (let c of prv.scd){
        c.sd = cudPara.d == null?c.sd:cudPara.d;
        c.sn = cudPara.ti == null?c.sn:cudPara.ti;
        c.st = cudPara.t == null?c.st:cudPara.t;
      }

      //TODO 缺少元素提醒
      //处理区分
     // content.option
     //  "检查日程缺失项目
     //  检查内容（日期，时间，主题）（提示缺少元素）"	SS.C
     //
     //  "修改时候检查
     //  是否被共享(提示不能修改)
     //  是否重复日程提醒（提示更新今天，还是以后）"	SS.U
     //  删除日程	SS.D

      // SS.C
      // SS.U
      // SS.D
      prv.option4Speech = content.option;

      //保存上下文
      DataConfig.putWsContext(prv);
      DataConfig.putWsOpt(content.option);



      return prv;


      //配置页面显示用数据
      // let scdEmData:ScdEmData = new ScdEmData();
      // scdEmData.id = prv.scd[0].si;
      // scdEmData.ti = prv.scd[0].sn;
      // scdEmData.d = prv.scd[0].sd;
      // scdEmData.t = prv.scd[0].st;
      // for (let p of prv.fs){
      //   let b:FriendEmData = new FriendEmData();
      //   b.a = p.hiu;
      //   b.id = p.pwi;
      //   b.m = p.rc;
      //   b.n = p.ran;
      //   b.p = p.ranpy;
      //   scdEmData.datas.push(b);
      // }
      //this.emitService.emitScd(scdEmData);
  }

}
