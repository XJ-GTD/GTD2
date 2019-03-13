import {Injectable} from "@angular/core";
import {PageDcData} from "../gc/gc.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";

@Injectable()
export class GlService {
  constructor(private sqlExce: SqliteExec) {
  }

  //获取本地群列表
  async getGroups() {
    let gld = new PageGlData();
    //获取本地群列表
    let dcl: Array<PageDcData> = await this.sqlExce.getList<PageDcData>(new GTbl());
    if(dcl.length>0){
      //和单群人数
      for(let dc of dcl){
        let fsl:Array<any> = await this.sqlExce.getList<any>(new BxTbl());
        dc.gc = fsl.length;
      }
      gld.gl = dcl;
    }
    return gld;
  }
}

export class PageGlData {

  gl:Array<PageDcData> = new Array<PageDcData>(); //群组成员

}
