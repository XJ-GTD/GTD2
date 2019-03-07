import {Injectable} from "@angular/core";
import {SQLiteObject} from "@ionic-native/sqlite";
import {FactionDb} from "./faction.db";
/**
 * create by on 2019/3/5
 */

@Injectable()
export class BaseTbl{

  private _database :SQLiteObject;

  constructor(private factionDb: FactionDb) {
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

  }
}
