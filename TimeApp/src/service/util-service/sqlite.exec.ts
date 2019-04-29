import {Injectable} from "@angular/core";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {UtilService} from "../util-service/util.service";
import {SqliteConfig} from "../config/sqlite.config";
import {ITbl} from "../sqlite/tbl/itbl";
import {LogTbl} from "../sqlite/tbl/log.tbl";
import * as moment from "moment";
import {DataConfig} from "../config/data.config";

/**
 * create by on 2019/3/5
 */

@Injectable()
export class SqliteExec {


  constructor(private sqlliteConfig: SqliteConfig, private sqlitePorter: SQLitePorter,
              private util: UtilService) {
  }

  /**
   * 执行语句
   */
  execSql(sql: string,nolog:boolean): Promise<any> {
    return new Promise((resolve, reject) => {

      let log:LogTbl = new LogTbl();
      log.id = this.util.getUuid();
      log.su = sql;
      log.ss = new Date().valueOf();
      log.t = 0;
      this.sqlliteConfig.database.transaction( (tx)=> {
        tx.executeSql(sql, [], (tx, res) => {
          if (!nolog){
            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.noteLog(log);
          }
          resolve(res);
        }, (tx, err) => {
          if (!nolog){
            log.ss = new Date().valueOf() - log.ss;
            log.st = true;
            this.noteLog(log);
          }
          resolve(err);
        });
      });

    });
  }

  /**
   * 创建表
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  create(itbl: ITbl): Promise<any> {
    return this.execSql(itbl.cT(),false);
  }

  /**
   * 删除表
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  drop(itbl: ITbl): Promise<any> {
    return this.execSql(itbl.drT(),false)
  }

  /**
   * 保存
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  save(itbl: ITbl): Promise<any> {
    return this.execSql(itbl.inT(),false)
  }

  /**
   * 更新
   */
  update(itbl: ITbl): Promise<any> {
    return this.execSql(itbl.upT(),false)

  }

  /**
   * 删除
   * @param param
   * @returns {Promise<any>}
   */
  delete(itbl: ITbl): Promise<number> {
    return this.execSql(itbl.dT(),false)
  }

  /**
   * 查询
   * @param t
   * @returns {Promise<T>}
   */
  getList<T>(itbl: ITbl): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      this.execSql(itbl.slT(),false).then(data => {
        let arr : Array<T> = new Array<T>();
        if (data.rows && data.rows.length > 0 ){
          for (let j = 0, len = data.rows.length; j < len; j++) {
            arr.push(data.rows.item(j))
          }
        }
        resolve(arr);
      })
    })
  }

  /**
   * sql字符串查询
   * @param t
   * @returns {Promise<T>}
   */
  getExtList<T>(sql: string): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      let arr : Array<T> = new Array<T>();
      console.log("getExtList执行SQL："+sql);
      this.execSql(sql,false).then(data => {
        if (data.rows && data.rows.length > 0 ){
          for (let j = 0, len = data.rows.length; j < len; j++) {
            arr.push(data.rows.item(j))
          }
        }
        resolve(arr);
      }).catch(e=>{
        console.error("getExtList执行SQL报错："+JSON.stringify(e));
        resolve(arr);
      })
    })
  }

  /**
   * 根据ID查询
   * @param t
   * @returns {Promise<T>}
   */
  getOne<T>(itbl: ITbl): Promise<T> {
    return new Promise((resolve, reject) => {
      return this.execSql(itbl.sloT(),false).then(data=>{
        if (data.rows && data.rows.length > 0 ){
          resolve(data.rows.item(0));
        }else{
          resolve(null);
        }
      });
    })
  }

  /**
   * 根据ID查询
   * @param t
   * @returns {Promise<T>}
   */
  getExtOne<T>(sql: string): Promise<T> {
    return new Promise((resolve, reject) => {
      return this.execSql(sql,false).then(data=>{
        if (data.rows && data.rows.length > 0 ){
          resolve(data.rows.item(0));
        }else{
          resolve(null);
        }
      });
    })
  }

  /**
   * 表数据替换
   * @param t
   * @returns {Promise<T>}
   */
  replaceT(itbl: ITbl): Promise<any> {
    return this.execSql(itbl.rpT(),false)
  }

  async batExecSql(sqlist: Array<string>) {

    if (this.util.isMobile()) {
      console.log("========= 批量出入SQL："+sqlist)
      return await this.sqlliteConfig.database.sqlBatch(sqlist)
    } else {

      if (this.util.hasCordova()) {
        let sql: string = "";
        for (let j = 0, len = sqlist.length; j < len; j++) {
          sql = sql + sqlist[j];
        }
        return this.sqlitePorter.importSqlToDb(this.sqlliteConfig.database, sql).catch(error=>{
          console.log("error=====================" + error);
        })

      } else {
        let count = 0;
        for (let j = 0, len = sqlist.length; j < len; j++) {
          if (sqlist[j] != null && sqlist[j] != '') {
            count++;
            await this.execSql(sqlist[j],false);
          } else {
            //console.error("sqls["+i+"]: ("+sqls[i]+ "） ;sqlAll:"+sql);
          }

        }
        return count;
      }
    }
  }

  /**
   * 批量执行
   * @param arrLen
   * @param {Array<string>} sqlist
   * @returns {Promise<any[]>}
   */
  // batchPromiseSql(arrLen,sqlist: Array<string>){
  //   let pro:Array<Promise<any>> = new Array<Promise<any>>();
  //   if(sqlist.length>arrLen){
  //     let len = sqlist.length/arrLen;
  //     len =Number(len.toString().split('.')[0]);
  //     for(let i=0;i<arrLen;i++){
  //       let sqla = new Array<string>();
  //       if(i==arrLen-1){
  //         sqla = sqlist.slice(i*len,sqlist.length);
  //       }else{
  //         sqla = sqlist.slice(i*len,i*len+len);
  //       }
  //       pro.push(this.batExecSql(sqla));
  //     }
  //   }
  //   return Promise.all(pro).then(values =>{
  //       // 返回的values由 promiseX 与 promiseY返回的值所构成的数组。
  //       console.log('batchPromiseSql:'+JSON.stringify(values));
  //     })
  // }


  //插入日志
   noteLog(log:LogTbl){
    if (DataConfig.isdebug){
      this.execSql(log.inT(),true)
    }
  }

  //查看日志

  getLogs(log:LogTbl):Promise<Array<LogTbl>>{
    return new Promise<Array<LogTbl>>((resolve, reject) => {

      let sql:string = `select id,su,ss,t,st,er,wtt from gtd_log where 1 = 1 `;
      if (log.su){
        sql = sql + ` and su = '${log.su}'`;
      }
      if (log.ss){
        sql = sql + ` and ss > ${log.ss}`;
      }

      if (log.t){
        sql = sql + ` and t >= ${log.t}`;
      }
      sql = sql + ` and st = ${log.st?1:0}`;

      if (log.searchs){
        sql = sql + ` and wtt >= ${log.searchs}`;
      }

      if (log.searche){
        sql = sql + ` and wtt <= ${log.searchs}`;
      }

      sql = sql + ` order by wtt desc`;

      this.execSql(sql,true).then(data=>{
        let arr : Array<LogTbl> = new Array<LogTbl>();
        if (data.rows && data.rows.length > 0 ){
          for (let j = 0, len = data.rows.length; j < len; j++) {
            arr.push(data.rows.item(j))
          }
        }
        resolve(arr);
      })
    })

  }

}
