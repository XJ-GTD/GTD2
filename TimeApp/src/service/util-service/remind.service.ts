import {Injectable} from "@angular/core";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {SqliteExec} from "./sqlite.exec";
import * as moment from "moment";
import {DataConfig} from "../config/data.config";

;

/**
 * 闹铃数据处理
 */
@Injectable()
export class RemindService {
  constructor(private sqlite:SqliteExec){ }

  public getRemindLs():Promise<Array<ETbl>>{
    let wd = moment().format("YYYY/MM/DD");
    let wt = moment().add(DataConfig.REINTERVAL,"s").format("HH:mm");
    let sql:string = `select * from gtd_e where wd = '${wd}' and wt <= '${wt}';`

    return this.sqlite.getExtList<ETbl>(sql);
  }

  public async  delRemin(es:Array<ETbl>){

    for (let e of es){
      let et:ETbl = new ETbl();
      et.wi = e.wi;
      await this.sqlite.delete(et);
    }
    return;
  }
}
