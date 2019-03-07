import {Injectable} from "@angular/core";
import {SQLiteObject} from "@ionic-native/sqlite";
import {FactionDb} from "./faction.db";
import {DataConfig} from "../../../app/data.config";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
/**
 * create by on 2019/3/5
 */

@Injectable()
export class BaseTbl{

  private _database :SQLiteObject;

  constructor(private factionDb: FactionDb,private sqlitePorter: SQLitePorter) {
    this._database = this.factionDb.database;
  }

  /**
   * 执行语句
   */
  _execSql(sql: string, array: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this._database.transaction(function(tx) {
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
        if(DataConfig.IS_MOBILE){
          this.sqlitePorter.importSqlToDb(this._database, sql)
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
