import {Injectable} from "@angular/core";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {UtilService} from "../util-service/util.service";
import {SqliteConfig} from "../config/sqlite.config";
import {ITbl} from "../sqlite/tbl/itbl";
import {LogTbl} from "../sqlite/tbl/log.tbl";
import * as moment from "moment";
import {DataConfig} from "../config/data.config";
import {ITblParam} from "../sqlite/tbl/itblparam";

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
  private execSqllog(sql: string,nolog:boolean, params: Array<any> = []): Promise<any> {
    return new Promise((resolve, reject) => {

      let log:LogTbl = new LogTbl();
      log.id = this.util.getUuid();
      log.su = sql;
      log.ss = new Date().valueOf();
      log.t = 0;
      this.sqlliteConfig.database.transaction( (tx)=> {
        tx.executeSql(sql, params, (tx, res) => {
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
   * 执行语句
   */
  execSql(sql: string, params: Array<any> = []): Promise<any> {
    return this.execSqllog(sql,false,params);
  }

  /**
   * 创建表
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  create(itbl: ITbl): Promise<any> {
    return this.execSql(itbl.cT());
  }

  /**
   * 删除表
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  drop(itbl: ITbl): Promise<any> {
    return this.execSql(itbl.drT())
  }

  /**
   * 保存
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  save(itbl: ITbl): Promise<any> {
    let arr = new Array<any>();
    for (let field in itbl) {
      arr.push(itbl[field]);
    }
    return this.execSql(itbl.inT())
  }

  /**
   * 预编译保存
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  prepareSave(itbl: ITbl): Promise<any> {
    let params = new Array<any>();

    for (let field in itbl) {
      let val = itbl[field];

      if (typeof val !== 'function') {
        params.push(val);
      }
    }

    return this.execSql(itbl.preT(), params);
  }

  /**
   * 更新
   */
  update(itbl: ITbl): Promise<any> {
    return this.execSql(itbl.upT())

  }

  /**
   * 删除
   * @param param
   * @returns {Promise<any>}
   */
  delete(itbl: ITbl): Promise<number> {
    return this.execSql(itbl.dT())
  }

  /**
   * 查询
   * @param t
   * @returns {Promise<T>}
   */
  getList<T>(itbl: ITbl): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      this.execSql(itbl.slT()).then(data => {
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
      this.execSql(sql).then(data => {
        if (data && data.rows && data.rows.length > 0 ){
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
      return this.execSql(itbl.sloT()).then(data=>{
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
      return this.execSql(sql).then(data=>{
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
    return this.execSql(itbl.rpT())
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
            await this.execSql(sqlist[j]);
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
    if (DataConfig.isdebug && DataConfig.islog){
      this.execSqllog(log.inT(),true);
    }
  }

  //查看日志

  getLogs(log:LogTbl):Promise<Array<LogTbl>>{
    return new Promise<Array<LogTbl>>((resolve, reject) => {

      let sql:string = `select id,su,ss,t,st,er,wtt from gtd_log where 1 = 1 `;
      if (log.su){
        sql = sql + ` and su = "${log.su}"`;
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

      this.execSqllog(sql,true).then(data=>{
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

  sqliteEscape(keyword: string) {
    return keyword.replace(/\//g, '//');
  }

  /**
   * 创建表Paramer方式
   * @param {ITblParam} itp
   * @returns {Promise<any>}
   */
  createByParam(itp: ITblParam): Promise<any> {
    return this.execSql(itp.cTParam());
  }

  /**
   * 删除表Paramer方式
   * @param {ITblParam} itp
   * @returns {Promise<any>}
   */
  dropByParam(itp: ITblParam): Promise<any> {
    return this.execSql(itp.drTParam());
  }

  /**
   * 保存Paramer方式
   * @param {ITblParam} itp
   * @returns {Promise<any>}
   */
  saveByParam(itp: ITblParam): Promise<any> {
    let doit = Array<any>();
    doit = itp.inTParam();
    let sq = doit[0];
    let params = doit[1];
    return this.execSql(sq,params);
  }

  /**
   * 更新Paramer方式
   * @param {ITblParam} itp
   * @returns {Promise<any>}
   */
  updateByParam(itp: ITblParam): Promise<any> {
    let doit = Array<any>();
    doit = itp.upTParam();
    let sq = doit[0];
    let params = doit[1];
    return this.execSql(sq,params);

  }

  /**
   * 删除paramer方式
   * @param param
   * @returns {Promise<number>}
   */
  delByParam(itp: ITblParam): Promise<number> {
    let doit = Array<any>();
    doit = itp.dTParam();
    let sq = doit[0];
    let params = doit[1];
    return this.execSql(sq,params);
  }

  /**
   * 查询param方式
   * @param {ITblParam} itp
   * @returns {Promise<Array<T>>}
   */
  getLstByParam<T>(itp: ITblParam): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      let doit = Array<any>();
      doit = itp.slTParam();
      let sq = doit[0];
      let params = doit[1];
      this.execSql(sq,params).then(data => {
        let arr : Array<T> = new Array<T>();
        if (data.rows && data.rows.length > 0 ){
          for (let j = 0, len = data.rows.length; j < len; j++) {
            arr.push(data.rows.item(j));
          }
        }
        resolve(arr);
      })
    })
  }

  /**
   * sql字符串复杂查询param方式
   * @param {string} sql
   * @param {Array<any>} params
   * @returns {Promise<Array<T>>}
   */
  getExtLstByParam<T>(sql: string,params:Array<any>): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      let arr : Array<T> = new Array<T>();
      console.log("getExtList执行SQL："+sql);
      this.execSql(sql,params).then(data => {
        if (data && data.rows && data.rows.length > 0 ){
          for (let j = 0, len = data.rows.length; j < len; j++) {
            arr.push(data.rows.item(j));
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
   * 根据ID查询 param方式
   * @param {ITblParam} itp
   * @returns {Promise<T>}
   */
  getOneByParam<T>(itp: ITblParam): Promise<T> {
    return new Promise((resolve, reject) => {
      let doit = Array<any>();
      doit = itp.sloTParam();
      let sq = doit[0];
      let params = doit[1];
      return this.execSql(sq,params).then(data=>{
        if (data.rows && data.rows.length > 0 ){
          resolve(data.rows.item(0));
        }else{
          resolve(null);
        }
      });
    })
  }

  /**
   * 查询复杂sql返回单条记录 param方式
   * @param {string} sql
   * @param {Array<any>} params
   * @returns {Promise<T>}
   */
  getExtOneByParam<T>(sql: string, params:Array<any>): Promise<T> {
    return new Promise((resolve, reject) => {
      return this.execSql(sql,params).then(data=>{
        if (data.rows && data.rows.length > 0 ){
          resolve(data.rows.item(0));
        }else{
          resolve(null);
        }
      });
    })
  }

  /**
   * 表数据替换 param方式
   * @param {ITblParam} itp
   * @returns {Promise<any>}
   */
  repTByParam(itp: ITblParam): Promise<any> {
    let doit = Array<any>();
    doit = itp.sloTParam();
    let sq = doit[0];
    let params = doit[1];
    return this.execSql(sq,params);
  }

  /**
   * 批量处理param方式
   * @param {Array<any>} sqlist
   * @returns {Promise<any>}
   */
  async batExecSqlByParam(sqlist: Array<any>) {

    if (this.util.isMobile()) {
      console.log("========= 批量出入SQL："+sqlist)
      return await this.sqlliteConfig.database.sqlBatch(sqlist);
    } else {

      let count = 0;
      for (let j = 0, len = sqlist.length; j < len; j++) {
        count++;
        if ( typeof sqlist[j]  == 'string' ){
          await this.execSql(sqlist[j]);
        }else{
          await this.execSql(sqlist[j][0],sqlist[j][1]);
        }

      }
      return count;

    }
  }
}

export enum SortType {
  ASC = 'asc',
  DESC = 'desc'
}
