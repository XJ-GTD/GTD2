import {Injectable} from "@angular/core";
import {PageDcData} from "../gc/gc.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {FsData} from "../../service/pagecom/pgbusi.service";

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
        let bx = new BxTbl();
        bx.bi = dc.gi;
        let fsl:Array<any> = await this.sqlExce.getList<FsData>(bx);
        dc.gc = fsl.length;
        dc.fsl = fsl;
      }
      gld.gl = dcl;
    }
    return gld;
  }

  //获取本地群列表
  async getGroupl(name:string) {
    let gld = new PageGlData();
    //获取本地群列表
    let sql = 'select * from gtd_g where gn like "'+name+'%"';
    let dcl: Array<PageDcData> = await this.sqlExce.getExtList<PageDcData>(sql);
    if(dcl.length>0){
      //和单群人数
      for(let dc of dcl){
        let bx = new BxTbl();
        bx.bi = dc.gi;
        let fsl:Array<any> = await this.sqlExce.getList<FsData>(bx);
        dc.gc = fsl.length;
        dc.fsl = fsl;
      }
      gld.gl = dcl;
    }
    return gld;
  }
}

export class PageGlData {

  gl:Array<PageDcData> = new Array<PageDcData>(); //群组成员

}
