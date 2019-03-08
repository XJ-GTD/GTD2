import {Injectable} from "@angular/core";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {UtilService} from "../util-service/util.service";
import {SqliteConfig} from "../config/sqlite.config";
/**
 * create by on 2019/3/5
 */

@Injectable()
export class SqliteExec{



  constructor(private sqlliteConfig: SqliteConfig,private sqlitePorter: SQLitePorter,
              private util:UtilService) {
  }

  /**
   * 执行语句
   */
  execSql(sql: string, array: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlliteConfig.database.transaction(function(tx) {
        tx.executeSql(sql, array,  (tx, res)=>{
          resolve(res);
        }, (tx, err) =>{
          console.log('error: ' + err.message);
          console.log("sql: "+sql);
          reject(err);
        });
      });

    });
  }

  async batExecSql(sqlist:Array<string>) {
        if(this.util.isMobile()){
          let sql : string ;
          for(var j = 0,len = sqlist.length; j < len; j++){
            sql = sql + sqlist[j];
          }
          return this.sqlitePorter.importSqlToDb(this.sqlliteConfig.database, sql)

        }else{
          let count = 0;
          for(var j = 0,len = sqlist.length; j < len; j++){
            if(sqlist[j] != null && sqlist[j] !=''){
              count ++ ;
              await this.execSql(sqlist[j],[]);
            }else{
              //console.error("sqls["+i+"]: ("+sqls[i]+ "） ;sqlAll:"+sql);
            }
          }
          return count;
        }
  }
}
