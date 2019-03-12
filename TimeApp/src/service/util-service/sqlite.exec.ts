import {Injectable} from "@angular/core";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {UtilService} from "../util-service/util.service";
import {SqliteConfig} from "../config/sqlite.config";
import {ITbl} from "../sqlite/tbl/itbl";

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
  execSql(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlliteConfig.database.transaction(function (tx) {
        tx.executeSql(sql, [], (tx, res) => {
          resolve(res);
        }, (tx, err) => {
          console.log('error: ' + err.message);
          console.log("sql: " + sql);
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
    return this.execSql(itbl.inT())
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
   * 根据ID查询
   * @param t
   * @returns {Promise<T>}
   */
  getOne(itbl: ITbl): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.execSql(itbl.sloT()).then(data=>{
        if (data.rows && data.rows.length > 0 ){
          resolve(data.rows.item(0));
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
      let sql: string;
      for (var j = 0, len = sqlist.length; j < len; j++) {
        sql = sql + sqlist[j];
      }
      return this.sqlitePorter.importSqlToDb(this.sqlliteConfig.database, sql)

    } else {
      let count = 0;
      for (var j = 0, len = sqlist.length; j < len; j++) {
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
