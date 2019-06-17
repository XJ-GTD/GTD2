import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {LocalcalendarService} from "../../service/cordova/localcalendar.service";
import {JtData, ScdData, ScdlData} from "../../data.mapping";

@Injectable()
export class TdlService {
  constructor(
    private sqlExce: SqliteExec,
    private readlocal: LocalcalendarService,
    private userConfig: UserConfig) {
  }

  /**
   * 获取日程 （每次返回30条数据，下拉返回日期之前，上推返回日期之后）
   * @param {string} today 点击日期
   * @param {string} action  1:下拉;2:上拉
   * @param {number} days 查询上下天数
   * @returns {Promise<ScdlData[]>}
   */
  async getL(today: string,action:string,days: number) {
    let mpL = new Array<ScdlData>();
    let startBefore = today;
    let startAfter = today;
    let n = 0;
    let sql = `select sp.rowid rowid,gc.si,gc.sn,gc.ui,gc.gs,sp.sd,sp.st,
      jh.jn,jh.jg,jh.jc,jh.jt,gb.pwi,gb.ran,gb.ranpy,gb.hiu,gb.rn ,sp.itx du,bh.hiu bhiu from gtd_c gc
      inner join gtd_sp sp on sp.si = gc.si left join gtd_b gb on gb.ui = gc.ui
      left join gtd_bh bh on bh.pwi = gb.pwi left join gtd_j_h jh on jh.ji = gc.ji `;
    // 如果action为1，插入过去日期空数据
    if(action =='1' || action != '2'){
      startBefore = moment(today).subtract(days-1, 'd').format("YYYY/MM/DD");
      //插入无日程天
      while (days > n) {
        let scdl: ScdlData = new ScdlData();
        scdl.d = moment(today).subtract(n, 'd').format("YYYY/MM/DD");
        scdl.id = moment(today).subtract(n, 'd').format("YYYYMMDD");
        scdl.bc = n%2;
        mpL.unshift(scdl);
        n++;
      }
    }
    //插入未来日期空数据
    if(action =='2' || action != '1') {
      startAfter = moment(today).add(days, 'd').format("YYYY/MM/DD");
      n = 1;
      //插入无日程天
      while (days >= n) {
        let scdl: ScdlData = new ScdlData();
        scdl.d = moment(today).add(n, 'd').format("YYYY/MM/DD");
        scdl.id = moment(today).add(n, 'd').format("YYYYMMDD");
        mpL.push(scdl);
        scdl.bc = n % 2;
        n++;
      }
    }
    //查询日程
    sql = sql + ` where sp.sd >= "${startBefore}" and  sp.sd <= "${startAfter}"`;
    let rclL = await this.sqlExce.getExtList(sql);
    //本地日历加入
    //let localL = await this.readlocal.findEventRc('', moment(startBefore), moment(start));
    let jtl:Array<JtData> = await this.getJtL(startBefore,startAfter);
    mpL = this.proceeLs(mpL, rclL, new Array<ScdData>(),jtl);
    return mpL;
  }

  /**
   * 根据日期段查询系统计划3
   * @param {string} sd 开始日期
   * @param {string} ed 结束日期
   * @returns {Promise<void>}
   */
  private async getJtL(sd:string,ed:string): Promise<Array<JtData>>{
    return new Promise<Array<JtData>>(async (resolve, reject) => {
      let sql = 'select * from gtd_jt where px > 0 and sd>="' + sd + '" and sd<="' + ed + '" order by px asc;';
      let data = await this.sqlExce.getExtList<JtData>(sql);
      resolve(data);
    })
  }

  private proceeLs(mpL: Array<ScdlData>, rclL: Array<any>, localL: Array<ScdData>,jtl:Array<JtData>): Array<ScdlData> {
    //循环获取数据并放入list
    for (let scd of rclL) {
      let sc: ScdData = new ScdData();
      Object.assign(sc, scd);
      Object.assign(sc.fs, scd);
      Object.assign(sc.p, scd);
      let cd: string = sc.sd;
      let tmp = mpL.find((n) => cd == n.d);
      if (tmp){
        tmp.scdl.push(sc);
      }
    }

    for (let scd of localL) {
      let cd: string = scd.sd;
      let tmp = mpL.find((n) => cd == n.d);
      if (tmp){
        tmp.scdl.push(scd);
      }
    }
    //循环获取计划3数据并放入list
    for (let jt of jtl) {
      let cd: string = jt.sd;
      let tmp = mpL.find((n) => cd == n.d);
      if (tmp){
        if (tmp.jtl.length <3)
          tmp.jtl.push(jt);
      }
    }
    //排序一天日程 按时间

    for (let tmp of mpL) {
      tmp.scdl = tmp.scdl.sort(
        (a, b) => {
          if (a.st < b.st) return -1;
          if (a.st == b.st) return 0;
          if (a.st > b.st) return 1;
        });
    }
    return mpL;

  }

}
