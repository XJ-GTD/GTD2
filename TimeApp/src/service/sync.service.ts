import {Injectable} from "@angular/core";
import {UserSqlite} from "./sqlite/user-sqlite";
import {UEntity} from "../entity/u.entity";
import {UModel} from "../model/u.model";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {BsModel} from "../model/out/bs.model";
import {PnRestful} from "./restful/pn-restful";
import { HTTP } from '@ionic-native/http';
import {LbSqlite} from "./sqlite/lb-sqlite";
import {SyncRestful} from "./restful/sync-restful";
import {DataConfig} from "../app/data.config";

/**
 * 初始化
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class SyncService {
  lbSqlite:LbSqlite;
  sync:SyncRestful;
  constructor( private baseSqlite: BaseSqlite,private http: HTTP) {
    this.lbSqlite=new LbSqlite(baseSqlite);
    this.sync=new SyncRestful(http);
  }

  /**
   * 初始化字典数据及标签表
   */
  initzdlb():Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      console.log("------SyncService initzdlb restful 初始化字典数据及标签表 --------")
      this.sync.init()
        .then(data => {
          console.log("-------SyncService initzdlb restful 初始化字典数据及标签表接口返回结果："+JSON.stringify(data))
          base = data
          resolve(base)
        }).catch(e=>{
        console.log("-------SyncService initzdlb restful 初始化字典数据及标签表 Error："+JSON.stringify(e))
        base.message = e.message
        base.code = 1
        reject(base)
      })
    })
  }
}
