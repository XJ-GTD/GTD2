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
import {UserConfig} from "../../service/config/user.config";
import {EventService,Parter} from "../../service/business/event.service";

/**
 * 查询联系人和日历
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class FindProcess extends BaseProcess implements MQProcess {
  constructor(private sqliteExec: SqliteExec, private fsService: FsService,
              private glService: GlService, private util:UtilService,private eventService:EventService,
              private userConfig: UserConfig) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,contextRetMap);
      }catch (e){
        rf = false;
      }

      if (!rf){
        return contextRetMap;
      }
    }

    //处理所需要参数
    let findData: FindPara = content.parameters;
    //查找联系人
    //let fs :Array<FsData> = new Array<FsData>();
    let fs :Array<Parter> = new Array<Parter>();
    fs = await this.findsimilarityfs(findData.fs);
    //console.log("============ mq返回内容："+ JSON.stringify(content));
    //处理区分
    //let ctbls:Array<CTbl> = new Array<CTbl>();
    //let scd:Array<ScdData> = new Array<ScdData>();

    if (content.option == F.C) {
      // TODO 增加根据人查询日程
      if (fs) {
        findData.scd.fs = fs;
      }
      //TODO 获取全部的日程事件,目前无法event.service中无此函数获取相关数据,只有根据evi获取单个日程的方法
      //let ctbls = await this.findScd(findData.scd);
//    for (let j = 0, len = ctbls.length; j < len; j++) {
//      let fss : Array<FsData> = new Array<FsData>();
//      fss = await this.findScdFss(ctbls[j].si);

		
        //let cfs :FsData = new FsData();
        //cfs = this.userConfig.GetOneBTbl(ctbls[j].ui);
        
        //防止在服务器与客户端交互时，因图像太大而出错
//      if (cfs){
//        cfs.bhiu = "";
//      }else{
//        cfs  = {} as Parter;
//      }
//
//      let c :ScdData = new ScdData();
//      Object.assign(c,ctbls[j]);
//      c.fs = cfs;
//      c.fss = fss;
//      scd.push(c);
//    }
    }

    //增加排序处理
    if (scd && scd.length > 1) {
      let sortedData = scd.sort((a, b) => {

        if (a.st != '99:99' && b.st == '99:99') {
          return 1;
        }

        if (a.st == '99:99' && b.st != '99:99') {
          return -1;
        }

        if (a.st > b.st) {
          return 1;
        }

        if (a.st < b.st) {
          return -1;
        }

        return 0;
      });
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
  private findsimilarityfs(ns: Array<any>): Array<Parter> {
    let res: Array<Parter> = new Array<Parter>();
    let rsbs: Map<string, Parter> = new Map<string, Parter>();
    if (!ns || ns.length == 0) {
      return new Array<Parter>();
    }

    //TODO 联系人和群组是否要放入环境中，每次取性能有影响

    //获取群组列表
    let gs: Array<PageDcData> = this.glService.getGroups(null);
    //循环参数中的pingy数组
    for (let n of ns) {
      //根据帐户id或者手机号查询时，不查询群组
      if (!n.n && (n.ai || n.mpn)) continue;

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
    let bs: Array<Parter> = this.fsService.getfriend(null);
    let b3ran: Array<string> = new Array();
    let b3rn: Array<string> = new Array();

    for (let b3 of bs) {
      b3ran.push(b3.ranpy);
      b3rn.push(b3.rnpy);
    }

    for (let n of ns) {
      //根据帐户id或者手机号查询时，不查询群组
      if (!n.n && (n.ai || n.mpn)) {
        for (let b1 of bs) {
          //注册用户存在用户ID
          if (n.ai && b1.ui && n.ai == b1.ui) {
            res.push(b1);
            continue;
          }

          //非注册用户不存在用户ID
          if (n.mpn && b1.rc && n.mpn == b1.rc) {
            res.push(b1);
          }
        }
      }

      if (n.n) {
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
    }

    rsbs.forEach((value, key, map) => {
      res.push(value);
    })
    return res;
  }
  //ying 20190901 add 注释:根据日程事件ID获取参与人
  private async findScdFss(si: string): Promise<Array<FsData>> {

    let res: Array<FsData> = new Array<FsData>();
    let sql = "select b.pwi ,b.ran ,b.ranpy  ,b.hiu ,b.rn ,b.rnpy ,b.rc   ," +
      " b.rel ,b.ui,b.wtt " +
      " from gtd_d d inner join gtd_b b on d.si = '"+ si +"' and d.ai = b.pwi"
    let fss :Array<BTbl> = new Array<BTbl>();
    fss = await this.sqliteExec.getExtList<BTbl>(sql);
    Object.assign(res,fss);
    return res;
  }

  //ying 20190901 add 注释:获取日程事件
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
          // 增加标签查找
          if (scd.marks && scd.marks.length > 0) {
            sql = sql + ` and (c.sn like "%${scd.ti}%" or c.si in (select mk.si from gtd_mk mk where 1=1`;

            for (let mark of scd.marks) {
              sql = sql + ` and mk.mkl like "%${mark}%"`;
            }

            sql = sql + `))`;
          } else {
            sql = sql + ` and c.sn like "%${scd.ti}%"`;
          }
        }
        if (scd.ds) {
          sql = sql + ` and sp.sd >= "${scd.ds}"`;
        } else {
          sql = sql + ` and sp.sd >= "${moment().subtract(30, 'd').format('YYYY/MM/DD')}"`;
        }
        if (scd.de) {
          sql = sql + ` and sp.sd <= "${scd.de}"`;
        } else {
          sql = sql + ` and sp.sd <= "${moment().add(30, 'd').format('YYYY/MM/DD')}"`;
        }
        if (scd.ts) {
          sql = sql + ` and (sp.st >= "${scd.ts}" or sp.st = '99:99')`;
        }
        if (scd.te) {
          sql = sql + ` and (sp.st <= "${scd.te}" or sp.st = '99:99')`;
        }
        // 根据人物查询
        if (scd.fs && scd.fs.length > 0) {
          sql = sql + ` and ( 1 > 1 `;
          for (let onefs of scd.fs) {
            sql = sql + ` or c.ui = "${onefs.ui}"`;
            sql = sql + ` or d.ai = "${onefs.pwi}"`;
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
