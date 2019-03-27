import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {RemindPara} from "../model/remind.para";
import {F, R, S} from "../model/ws.enum";
import {FindPara} from "../model/find.para";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";

/**
 * 查询联系人和日历
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class FindProcess implements MQProcess{
  constructor(private sqliteExec: SqliteExec,) {
  }

  go(content: WsContent,processRs:ProcesRs):Promise<ProcesRs> {

    return new Promise<ProcesRs>(async resolve => {
      //处理所需要参数
      let findData: FindPara = content.parameters;
      findData.fs[0]

      //查找联系人

      //处理区分
      // if (content.option == F.C) {
      //   await this.saveETbl1(rdData);
      //
      // } else if (content.option == R.C) {
      //   if (processRs == null) return;
      //   for (let scd of processRs.scd) {
      //     await this.saveETbl2(rdData, scd);
      //   }
      // }


    })
  }

  private findfs(findData: FindPara):Promise<Array<BTbl>>{
    return new Promise<Array<BTbl>>(async resolve => {

      //TODO 联系人和群组是否要放入环境中，每次取性能有影响
      //获取联系人列表
      let bTbl: BTbl = new BTbl();
      let bs:Array<BTbl> = await this.sqliteExec.getList<BTbl>(bTbl);

      //获取群组列表
      let bxTbl: BxTbl = new BxTbl();
      let bxs:Array<BxTbl> = await this.sqliteExec.getList<BxTbl>(bxTbl);
      for(let n of findData.fs){

        for(let bx of bxs){
         // bx.
        }
      }
    })
  }
}
