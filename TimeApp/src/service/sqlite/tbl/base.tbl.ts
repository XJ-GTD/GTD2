import {BaseSqlite} from "../base-sqlite";
import {Injectable} from "@angular/core";
/**
 * create by on 2019/3/5
 */

@Injectable()
export class BaseTbl{

  private _sq :string;

  constructor(private baseSqlite: BaseSqlite) {}


  get sq(): string {
    return this._sq;
  }

  set sq(value: string) {
    this._sq = value;
  }

  cT():Promise<any> {
    return this._doT(this._sq);
  }

  upT():Promise<any> {
    return this._doT(this._sq);
  }

  dT():Promise<any> {
    return this._doT(this._sq);
  }

  sloT():Promise<any> {
    return this._doT(this._sq);
  }

  slT():Promise<any> {
    return this._doT(this._sq);
  }

  drT():Promise<any> {
    return this._doT(this._sq);
  }

  inT():Promise<any> {
    return this._doT(this._sq);
  }

  rpT():Promise<any> {
    return this._doT(this._sq);
  }

  _doT(sq):Promise<any> {
      return this.baseSqlite.executeSql(sq,[]);
  }

}
