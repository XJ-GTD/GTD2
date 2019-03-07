import {Injectable} from "@angular/core";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {SQLiteFactory} from "./sqlite.factory";
import {UtilService} from "../../util-service/util.service";
/**
 * create by on 2019/3/5
 */

@Injectable()
export class BaseTbl{



  constructor(private sqlFactory: SQLiteFactory,private sqlitePorter: SQLitePorter,
              private util:UtilService) {
  }

  /**
   * 执行语句
   */
  _execSql(sql: string, array: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlFactory.database.transaction(function(tx) {
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

  _batExecSql(sqlist:Array<string>):Promise<any> {
      return new Promise((resolve, reject) => {
        let sql : string ;
        for(var j = 0,len = sqlist.length; j < len; j++){
          sql = sql + sqlist[j];
        }

        if(this.util.isMobile()){
          this.sqlitePorter.importSqlToDb(this.sqlFactory.database, sql)
            .then((count) => {
              console.log('Imported');

              resolve(count);
            })
            .catch((error)=> {
              console.error(error);
              alert("批量sql执行错误:"+error.message);
              reject(error);
            });
        }else{
          for(var j = 0,len = sqlist.length; j < len; j++){
            if(sqlist[j] != null && sqlist[j] !=''){
              this._execSql(sqlist[j],[]);
            }else{
              //console.error("sqls["+i+"]: ("+sqls[i]+ "） ;sqlAll:"+sql);
            }
          }
          resolve(sqlist.length);
        }

      });
  }
}
