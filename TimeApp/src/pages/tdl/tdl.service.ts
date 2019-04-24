import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {LocalcalendarService} from "../../service/cordova/localcalendar.service";
import {ScdData, ScdlData} from "../../data.mapping";

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
    let startBefore = moment(today).subtract(days-1, 'd').format("YYYY/MM/DD");
    let n = 0;
    let sql = 'select sp.rowid rowid,gc.si,gc.sn,gc.ui,gc.gs,sp.sd,sp.st,' +
      'jh.jn,jh.jg,jh.jc,jh.jt,gb.pwi,gb.ran,gb.ranpy,gb.hiu,gb.rn ,sp.itx du from gtd_c gc ' +
      'inner join gtd_sp sp on sp.si = gc.si left join gtd_b gb on gb.ui = gc.ui left join gtd_j_h jh on jh.ji = gc.ji ';
    let before ='';
    let after ='';
    if(action =='1' || action != '2'){
      //插入无日程天
      while (days > n) {
        let scdl: ScdlData = new ScdlData();
        scdl.d = moment(today).subtract(n, 'd').format("YYYY/MM/DD");
        scdl.id = moment(today).subtract(n, 'd').format("YYYYMMDD");
        scdl.bc = n%2;
        mpL.unshift(scdl);
        n++;
      }
      //获取本地日程jn jg jc jt
      before = sql + ` where sp.sd <='${today}' and  sp.sd >= '${startBefore}'`;
    }
    if(action =='2' || action != '1') {
      let startAfter = moment(today).add(days, 'd').format("YYYY/MM/DD");
      n = 0;
      //插入无日程天
      while (days >= n) {
        let scdl: ScdlData = new ScdlData();
        scdl.d = moment(today).add(n, 'd').format("YYYY/MM/DD");
        scdl.id = moment(today).add(n, 'd').format("YYYYMMDD");
        mpL.push(scdl);
        scdl.bc = n % 2;
        n++;
      }
      //获取本地日程jn jg jc jt
      after = sql + ` where sp.sd > '${today}' and  sp.sd <= '${startAfter}'`;
    }

    if(action !='1' && action != '2'){
      sql = 'select * from ('+ before + ' union ' + after + ') order by sd,st asc;'
    }else if(action =='1'){
      sql = before + 'order by sp.sd,sp.st asc;'
    }else if(action =='2'){
      sql =  after + ' order by sp.sd,sp.st asc;'
    }
    let rclL = await this.sqlExce.getExtList(sql);
    //本地日历加入
    //let localL = await this.readlocal.findEventRc('', moment(startBefore), moment(start));
    mpL = this.proceeLs(mpL, rclL, new Array<ScdData>());
    return mpL;
  }


  private proceeLs(mpL: Array<ScdlData>, rclL: Array<any>, localL: Array<ScdData>): Array<ScdlData> {
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
      let cd: string = scd.sd
      let tmp = mpL.find((n) => cd == n.d);
      if (tmp){
        tmp.scdl.push(scd);
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


  // /**
  //  * （每次返回30条数据，下拉返回日期之前，包含当前选中日期日期）
  //  * @param {string} next
  //  * @returns {Promise<ScdlData[]>}
  //  */
  // async before(start: string, days: number) {
  //   let mpL = new Array<ScdlData>();
  //   let startBefore = moment(start).subtract(days-1, 'd').format("YYYY/MM/DD");
  //   let n = 0;
  //
  //   //插入无日程天
  //   while (days > n) {
  //     let scdl: ScdlData = new ScdlData();
  //     scdl.d = moment(start).subtract(n, 'd').format("YYYY/MM/DD");
  //     scdl.id = moment(start).subtract(n, 'd').format("YYYYMMDD");
  //     scdl.bc = n%2;
  //     mpL.unshift(scdl);
  //     n++;
  //   }
  //   //获取本地日程jn jg jc jt
  //   let sqll = `select sp.rowid rowid,gc.si,gc.sn,gc.ui,gc.gs,sp.sd,sp.st,
  //       jh.jn,jh.jg,jh.jc,jh.jt,gb.pwi,gb.ran,gb.ranpy,gb.hiu,gb.rn,sp.itx du from gtd_c gc
  //       inner join gtd_sp sp on sp.si = gc.si
  //       left join gtd_b gb on gb.ui = gc.ui left join gtd_j_h jh on jh.ji = gc.ji
  //       where sp.sd <='${start}' and  sp.sd >= '${startBefore}' order by sp.sd,sp.st desc;`;
  //   let rclL = await this.sqlExce.getExtList(sqll);
  //   //本地日历加入
  //   let localL = await this.readlocal.findEventRc('', moment(startBefore), moment(start));
  //   mpL = this.proceeLs(mpL, rclL, localL);
  //   return mpL;
  // }
  //
  // /**
  //  * （每次返回30天数据，上推返回日期之后,包含当前日期）
  //  * @param {string} next
  //  * @returns {Promise<ScdlData[]>}
  //  */
  // async after(start: string, days: number) {
  //   let mpL = new Array<ScdlData>();
  //   let startAfter = moment(start).add(days, 'd').format("YYYY/MM/DD");
  //   let n = 0;
  //
  //   //插入无日程天
  //   while (days >= n) {
  //     let scdl: ScdlData = new ScdlData();
  //     scdl.d = moment(start).add(n, 'd').format("YYYY/MM/DD");
  //     scdl.id = moment(start).add(n, 'd').format("YYYYMMDD");
  //     mpL.push(scdl);
  //     scdl.bc = n%2;
  //     n++;
  //   }
  //   //获取本地日程jn jg jc jt
  //   let sqll = `select sp.rowid rowid,gc.si,gc.sn,gc.ui,gc.gs,sp.sd,sp.st,
  //       jh.jn,jh.jg,jh.jc,jh.jt,gb.pwi,gb.ran,gb.ranpy,gb.hiu,gb.rn ,sp.itx du from gtd_c gc
  //       inner join gtd_sp sp on sp.si = gc.si
  //       left join gtd_b gb on gb.ui = gc.ui left join gtd_j_h jh on jh.ji = gc.ji
  //       where sp.sd >= '${start}' and  sp.sd <= '${startAfter}' order by sp.sd,sp.st desc;`;
  //   let rclL = await this.sqlExce.getExtList(sqll);
  //   //本地日历加入
  //   let localL = await this.readlocal.findEventRc('', moment(start), moment(startAfter));
  //   mpL = this.proceeLs(mpL, rclL, localL);
  //
  //   return mpL;
  // }

}





