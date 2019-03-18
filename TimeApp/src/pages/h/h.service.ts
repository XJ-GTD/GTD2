import {Injectable} from "@angular/core";
import {ScdData} from "../tdl/tdl.service";
import {BsModel} from "../../service/restful/out/bs.model";
import * as moment from "moment";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {AgdbusiService} from "../../service/util-service/agdbusi.service";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";

@Injectable()
export class HService {
  constructor(private sqlexec :SqliteExec,private agdbusi :AgdbusiService) {
  }

  //首页显示 参数月：YYYY/MM
  async showHomePage(m){
    let ret = new Map<string,Array<ScdData>>();
    let sday = m + "/" +　"01";
    let nday = moment(m,"YYYY/MM").daysInMonth();
    let eday = m + "/" + nday;

    //获取计划信息
    let jh = new JhTbl();
    let jhList = new Array<JhTbl>()
    jhList = await this.sqlexec.getList<JhTbl>(jh);

    //获取时间段内日程信息
    let sql = 'select * from gtd_c  where ' +
      ' (ed <> "" and sd <= "'+ eday +'" and ed >= "'+ sday +'" ) ' +
      ' or (ed = "" and sd <= "'+ eday +'")';

    let data = new Array<CTbl>();
    data = await this.sqlexec.getExtList<CTbl>(sql);


    //加载月份里每条日期所包含的日程
    let curDate = sday;
    for (let i = 0, len = nday; i < len; i++) {
      let ishave = false;
      let scdList = new Array<ScdData>();
      for (let j = 0, len = data.length; j < len; j++) {
        //当期日期是否在日程中存在
        ishave = this.agdbusi.ishave( curDate,data[j]);
        if (ishave){
          let scd = new ScdData();
          Object.assign(scd,data[j]);

          //获取相应计划内容
          for (let k = 0, len = jhList.length; k < len; k++) {
            if (scd.ji == jhList[k].ji){
              scd.p.ji = jhList[k].ji;
              scd.p.jn = jhList[k].jn;
              scd.p.jg = jhList[k].jg;
              scd.p.jc = jhList[k].jc;
              scd.p.jt = jhList[k].jt;
              scd.p.wtt = jhList[k].wtt;
              break;
            }
          }
          scdList.push(scd);
        }
      }

      ret.set(curDate,scdList);
      curDate = moment(curDate).add(1,'d').format('YYYY/MM/DD');
    }

    let bs = new BsModel();
    bs.code = 0;
    bs.data = ret ;
    return bs;
  }
}
