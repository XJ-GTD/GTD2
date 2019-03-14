import {ITbl} from "./itbl";
import * as moment from 'moment';

/**
 * create by on 2019/3/5
 */
export class ETbl implements ITbl {
  get wtt(): number {
    return this._wtt;
  }

  set wtt(value: number) {
    this._wtt = value;
  }

  private _wi: string = "";
  private _si: string = "";
  private _st: string = "";
  private _wd: string = "";
  private _wt: string = "";
  private _wtt: number;


  get wi(): string {
    return this._wi;
  }

  set wi(value: string) {
    this._wi = value;
  }

  get si(): string {
    return this._si;
  }

  set si(value: string) {
    this._si = value;
  }

  get st(): string {
    return this._st;
  }

  set st(value: string) {
    this._st = value;
  }

  get wd(): string {
    return this._wd;
  }

  set wd(value: string) {
    this._wd = value;
  }

  get wt(): string {
    return this._wt;
  }

  set wt(value: string) {
    this._wt = value;
  }

  clp() {
    this._wi = "";
    this._si = "";
    this._st = "";
    this._wd = "";
    this._wt = "";
    this._wtt = 0;
  };

  cT(): string {

    let sq = 'create table if not exists gtd_e(  wi varchar(50) primary key ,si varchar(50)  ,' +
      'st varchar(50)  ,wd varchar(20)  ,wt varchar(20) ,wtt integer);';

    return sq;
  }

  upT(): string {
    let sq = '';
    if (this._si != null && this._si != "") {
      sq = sq + ', si="' + this._si + '"';
    }
    if (this._st != null && this._st != "") {
      sq = sq + ', st="' + this._st + '"';
    }
    if (this._wd != null && this._wd != "") {
      sq = sq + ', wd="' + this._wd + '"';
    }
    if (this._wt != null && this._wt != "") {
      sq = sq + ', wt="' + this._wt + '"';
    }
    sq = sq + ', wtt=' + moment().unix();
    if (sq != null && sq != "") {
      sq = sq.substr(1);
    }
    sq = 'update gtd_e set  ' + sq + ' where wi = "' + this._wi + '";';
    return sq;
  }

  dT(): string {
    let sq = 'delete from gtd_e where 1=1 ';
    if (this._wi != null && this._wi != "") {
      sq = sq + 'and  wi ="' + this._wi + '"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT(): string {
    let sq = 'select * from gtd_e where wi = "' + this._wi + '";';

    return sq;
  }

  slT(): string {
    let sq = 'select * from  gtd_e where  1=1 ';
    if (this._si != null && this._si != "") {
      sq = sq + ' and si="' + this._si + '"';
    }
    if (this._st != null && this._st != "") {
      sq = sq + ' and st="' + this._st + '"';
    }
    if (this._wd != null && this._wd != "") {
      sq = sq + ' and wd="' + this._wd + '"';
    }
    if (this._wt != null && this._wt != "") {
      sq = sq + ' and wt="' + this._wt + '"';
    }
    sq = sq + ';';
    return sq;
  }

  drT(): string {

    let sq = 'drop table if exists gtd_e;';
    return sq;
  }

  inT(): string {
    let sq = 'insert into gtd_e ' +
      '(  wi ,si ,st ,wd ,wt,wtt) values("' + this._wi + '","' + this._si + '","' + this._st + '"' +
      ',"' + this._wd + '","' + this._wt + ',"' + moment().unix() + ');';

    return sq;
  }

  rpT(): string {
    let sq = 'replace into gtd_e ' +
      '(  wi ,si ,st ,wd ,wt,wtt) values("' + this._wi + '","' + this._si + '","' + this._st + '"' +
      ',"' + this._wd + '","' + this._wt + ',"' + moment().unix() + ');';

    return sq;
  }

}
