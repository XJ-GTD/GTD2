import {BaseSqlite} from "../base-sqlite";
import {Injectable} from "@angular/core";
/**
 * create by on 2019/3/5
 */

@Injectable()
export class BaseTbl{

  constructor(private baseSqlite: BaseSqlite) {}

  _execT(sq):Promise<any> {
      return this.baseSqlite.executeSql(sq,[]);
  }

  _batT(sq):Promise<any> {
    return this.baseSqlite.executeSql(sq,[]);
  }
}
