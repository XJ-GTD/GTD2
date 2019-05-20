import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {F} from "../model/ws.enum";
import {FindPara} from "../model/find.para";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {FsService} from "../../pages/fs/fs.service";
import {GlService} from "../../pages/gl/gl.service";
import {FsData, PageDcData, ScdData} from "../../data.mapping";
import {UtilService} from "../../service/util-service/util.service";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";

/**
 * 查询联系人和日历
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class FindProcess extends BaseProcess implements MQProcess {
  constructor(private sqliteExec: SqliteExec, private fsService: FsService,
              private glService: GlService, private util:UtilService) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let fun = eval("("+content.when+")");
      if (!fun(content,contextRetMap)){
        return contextRetMap;
      }
    }

    //处理所需要参数
    let findData: FindPara = content.parameters;
    //查找联系人
    let fs :Array<FsData> = new Array<FsData>();
    fs = await this.findsimilarityfs(findData.fs);
    //console.log("============ mq返回内容："+ JSON.stringify(content));
    //处理区分
    let ctbls:Array<CTbl> = new Array<CTbl>();
    let scd:Array<ScdData> = new Array<ScdData>();
    if (content.option == F.C) {
      // TODO 增加根据人查询日程
      if (fs) {
        findData.scd.fs = fs;
      }
      let ctbls = await this.findScd(findData.scd);
      for (let j = 0, len = ctbls.length; j < len; j++) {
        let fss : Array<FsData> = await this.findScdFss(ctbls[j].si);
        let c :ScdData = new ScdData();
        Object.assign(c,ctbls[j]);
        c.fss = fss;
        scd.push(c);
      }
    }

    //服务器要求上下文内放置日程查询结果
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, scd);


    //服务器要求上下文内放置日程的创建人员信息或查询条件用的人员信息
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, fs);

    return contextRetMap;
  }

  private findfs(ns: Array<any>): Array<FsData> {
    let res: Array<FsData> = new Array<FsData>();
    let rsbs: Map<string, FsData> = new Map<string, FsData>();
    if (!ns || ns.length == 0) {
      return new Array<FsData>();
    }

    //TODO 联系人和群组是否要放入环境中，每次取性能有影响

    //获取群组列表
    let gs: Array<PageDcData> = this.glService.getGroups(null);
    //循环参数中的pingy数组
    for (let n of ns) {
      let piny = n.n;
      //首先查找群组
      for (let g of gs) {
        if (piny.indexOf(g.gnpy) > -1) {
          piny = piny.replace(g.gnpy, "");
          for (let b1 of g.fsl) {
            rsbs.set(b1.ranpy, b1);
          }
        }
      }
    }

    //获取联系人列表
    let bs: Array<FsData> = this.fsService.getfriend(null);
    for (let n of ns) {
      let piny = n.n;
      //首先查找群组
      for (let b3 of bs) {
        if (piny.indexOf(b3.ranpy) > -1 || piny.indexOf(b3.rnpy) > -1) {
          piny = piny.replace(b3.ranpy, "").replace(b3.rnpy, "");
          rsbs.set(b3.ranpy, b3);
        }
      }
    }
    rsbs.forEach((value, key, map) => {
      res.push(value);
    })
    return res;
  }

  // 根据相似性匹配本地联系人
  private findsimilarityfs(ns: Array<any>): Array<FsData> {
    let res: Array<FsData> = new Array<FsData>();
    let rsbs: Map<string, FsData> = new Map<string, FsData>();
    if (!ns || ns.length == 0) {
      return new Array<FsData>();
    }

    //TODO 联系人和群组是否要放入环境中，每次取性能有影响

    //获取群组列表
    let gs: Array<PageDcData> = this.glService.getGroups(null);
    //循环参数中的pingy数组
    for (let n of ns) {
      let piny = n.n;
      //首先查找群组
      for (let g of gs) {
        let simulary = this.util.compareTwoStrings(piny, g.gnpy);
        console.log(piny + ' <=> ' + g.gnpy + ' distance ' + simulary);
        if (simulary > 0.8) {
          //piny = piny.replace(g.gnpy, "");
          for (let b1 of g.fsl) {
            rsbs.set(b1.ranpy, b1);
          }
        }
      }
    }

    //获取联系人列表
    let bs: Array<FsData> = this.fsService.getfriend(null);
    let b3ran: Array<string> = new Array();
    let b3rn: Array<string> = new Array();

    for (let b3 of bs) {
      b3ran.push(b3.ranpy);
      b3rn.push(b3.rnpy);
    }

    for (let n of ns) {
      let piny = n.n;
      //查找联系人
      let simularyranrs = this.util.findBestMatch(piny, b3ran);
      let simularyrnrs = this.util.findBestMatch(piny, b3rn);

      if (simularyranrs.bestMatch.rating > 0.5) {
        let index = 0;
        for (let rating of simularyranrs.ratings) {
          if (rating.rating > 0.8) {
            console.log(piny + ' <=> ' + b3ran[index] + ' distance ' + rating.rating);
            rsbs.set(b3ran[index], bs[index]);
          }
          index++;
        }
      }

      if (simularyrnrs.bestMatch.rating > 0.5) {
        let index = 0;
        for (let rating of simularyrnrs.ratings) {
          if (rating.rating > 0.8) {
            console.log(piny + ' <=> ' + b3rn[index] + ' distance ' + rating.rating);
            rsbs.set(b3ran[index], bs[index]);
          }
          index++;
        }
      }
    }
    rsbs.forEach((value, key, map) => {
      res.push(value);
    })
    return res;
  }

  private async findScdFss(si: string): Promise<Array<FsData>> {

    let res: Array<FsData> = new Array<FsData>();
    let sql = "select b.pwi ,b.ran ,b.ranpy  ,b.hiu ,b.rn ,b.rnpy ,b.rc   ," +
      " b.rel ,b.ui,b.wtt,bh.hiu bhiu " +
      " from gtd_d d inner join gtd_b b on d.si = '"+ si +"' and d.ai = b.pwi" +
      " left join gtd_bh bh on b.pwi = bh.pwi  "
    let fss :Array<BTbl> = new Array<BTbl>();
    fss = await this.sqliteExec.getExtList<BTbl>(sql);
    Object.assign(res,fss);
    return res;
  }
  private findScd(scd: any): Promise<Array<CTbl>> {
    return new Promise<Array<CTbl>>(async resolve => {
      console.log("============ mq查询日程scd："+ JSON.stringify(scd));
      let res: Array<CTbl> = new Array<CTbl>();
      if (scd.de ||
        scd.ds ||
        scd.te ||
        scd.ti ||
        scd.ts ||
        (scd.fs && scd.fs.length > 0)) {
        let sql: string = `select distinct c.si,
                                           c.sn,
                                           c.ui,
                                           sp.sd     sd,
                                           c.st,
                                           c.ed,
                                           c.et,
                                           c.rt,
                                           c.ji,
                                           c.sr,
                                           c.bz,
                                           sp.wtt    wtt,
                                           c.tx,
                                           c.pni,
                                           c.du,
                                           c.gs
                           from gtd_sp sp
                                  inner join gtd_c c on sp.si = c.si
                                  left join gtd_d d on d.si = c.si
                           where 1 = 1 and (c.gs = '0' or c.gs = '1' or c.gs = '2')`

        if (scd.ti) {
          sql = sql + ` and c.sn like '%${scd.ti}%'`;
        }
        if (scd.ds) {
          sql = sql + ` and sp.sd >= '${scd.ds}'`;
        } else {
          sql = sql + ` and sp.sd >= '${moment().subtract(30, 'd').format('YYYY/MM/DD')}%'`;
        }
        if (scd.de) {
          sql = sql + ` and sp.sd <= '${scd.de}'`;
        } else {
          sql = sql + ` and sp.sd <= '${moment().add(30, 'd').format('YYYY/MM/DD')}%'`;
        }
        if (scd.ts) {
          sql = sql + ` and (sp.st >= '${scd.ts}' or sp.st = '99:99')`;
        }
        if (scd.te) {
          sql = sql + ` and (sp.st <= '${scd.te}' or sp.st = '99:99')`;
        }
        // 根据人物查询
        if (scd.fs && scd.fs.length > 0) {
          sql = sql + ` and ( 1 > 1 `;
          for (let onefs of scd.fs) {
            sql = sql + ` or c.ui = '${onefs.ui}'`;
            sql = sql + ` or d.ai = '${onefs.pwi}'`;
          }
          sql = sql + ` )`;
        }
        console.log("============ mq查询日程："+ sql);
        res = await this.sqliteExec.getExtList<CTbl>(sql);
      }
      resolve(res);
      return res;
    })
  }
}
