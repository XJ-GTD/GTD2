import {Injectable} from "@angular/core";
import {SqliteExec} from "../service/util-service/sqlite.exec";
import {CTbl} from "../service/sqlite/tbl/c.tbl";

@Injectable()
export class BrService {
  constructor( private sqlexec: SqliteExec,
              ) {

  }

  //根据日程ID计算日程相关日期，重复日程日期规则
  //1.如果是日程为未来日，则日期为未来日，标记为重复
  //2.如果日程为当日，则把当日+1天放入记录
  //3.如果日程为过去日，则把已经过的日期到当日+1天放入记录
  getCdlist(si :string): Promise<Map<string,CTbl>> {

    return new Promise((resolve, reject) => {
      let c = new CTbl();
      c.si= si;
      this.sqlexec.getOne<CTbl>(c).then(data => {
        let ret :Map<string,CTbl> = new Map();
        //重复类型：关闭
        if (data.rt == "0"){
          ret.set(data.sd,data);
        }
        //每日
        if (data.rt == "1"){
          ret.set(data.sd,data);
        }
        resolve(ret);
      })
    })
  }


}


export class PageBrDataPro {
  //画面时间戳
  bts: string = "";

  //页面时间
  dt: string = "";
}
