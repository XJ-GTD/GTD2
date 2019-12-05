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
import {EventService,Member} from "../../service/business/event.service";
import {CalendarService, FindActivityCondition, ActivityData} from "../../service/business/calendar.service";

/**
 * 查询联系人和日历
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class FindProcess extends BaseProcess implements MQProcess {
  constructor(private sqliteExec: SqliteExec, private fsService: FsService,private calendarService:CalendarService,
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
    let fs :Array<FsData> = new Array<FsData>();
    //let fs :Array<Parter> = new Array<Parter>();
    //fs = await this.findsimilarityfs(findData.fs);
    //console.log("============ mq返回内容："+ JSON.stringify(content));
    //处理区分
    //let ctbls:Array<CTbl> = new Array<CTbl>();
    let scd: ActivityData = new ActivityData();

    if (content.option == F.C) {
      // TODO 增加根据人查询日程
      if (fs) {
        findData.scd.fs = fs;
      }
      //TODO 使用findActivities ,该方法联系人尚未完善
      let condition: FindActivityCondition = new FindActivityCondition();

      let finds = findData.scd;
      if (finds.ds)  condition.sd = finds.ds;
      if (finds.ts)  condition.st = finds.ts;
      if (finds.de)  condition.ed = finds.de;
      if (finds.te)  condition.et = finds.te;
      if (finds.ti)  condition.text = finds.ti;
      if (finds.marks)  condition.mark = finds.marks;

      scd = await this.calendarService.findActivities(condition);

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
    // if (scd && scd.length > 0) {
    //   scd.sort((a, b) => {
    //     let evda: string = a.evd? a.evd : a.sd;
    //     let evta: string = a.evt? a.evt : a.st;
    //     let evdb: string = b.evd? b.evd : b.sd;
    //     let evtb: string = b.evt? b.evt : b.st;
    //
    //     return moment(evda + " " + evta, "YYYY/MM/DD HH:mm", true).diff(moment(evdb + " " + evtb, "YYYY/MM/DD HH:mm", true));
    //   });
    // }

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
      //根据帐户id或者手机号查询时，不查询群组
      if (!n.n && (n.ai || n.mpn)) continue;

      let piny = n.n;
      //首先查找群组
      for (let g of gs) {
        let simulary = this.util.compareTwoStrings(piny, g.gnpy);
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
               rsbs.set(b3ran[index], bs[index]);
            }
            index++;
          }
        }

        if (simularyrnrs.bestMatch.rating > 0.5) {
          let index = 0;
          for (let rating of simularyrnrs.ratings) {
            if (rating.rating > 0.8) {
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
}
