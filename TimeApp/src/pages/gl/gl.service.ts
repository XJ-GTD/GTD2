import {Injectable} from "@angular/core";
import {PageDcData} from "../gc/gc.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {FsData} from "../../service/pagecom/pgbusi.service";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";

@Injectable()
export class GlService {
  constructor(private sqlExce: SqliteExec) {
  }

  //获取本地群列表
  getGroups(name:string):Array<PageDcData> {
    if (name)
    return UserConfig.groups.filter((value)=>{
      return value.gn.indexOf(name) > -1 || value.gnpy.indexOf(name) > -1
    });
    else
      return UserConfig.groups;
  }
}

export class PageGlData {

  gl:Array<PageDcData> = new Array<PageDcData>(); //群组成员

}
