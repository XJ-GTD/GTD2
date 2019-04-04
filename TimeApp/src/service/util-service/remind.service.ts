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
    let wt = moment().add(DataConfig.REINTERVAL,"m").format("HH:SS");
   // let sql:string = `select * from gtd_e where wd = '${wd}' and wt <= '${wt}';`
    let sql:string = `select * from gtd_e where wd = '${wd}';`
    console.log("localNotification*******************************"+sql);

    return this.sqlite.getExtList<ETbl>(sql);
  }

  public async  delRemin(es:Array<ETbl>){

    for (let e of es){
      await this.sqlite.delete(e);
    }
    return
  }
}
