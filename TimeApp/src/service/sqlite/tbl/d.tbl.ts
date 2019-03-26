/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import * as moment from "moment";


export class DTbl implements ITbl {
  get pi(): string {
    return this._pi;
  }

  set pi(value: string) {
    this._pi = value;
  }

  get si(): string {
    return this._si;
  }

  set si(value: string) {
    this._si = value;
  }

  get ai(): string {
    return this._ai;
  }

  set ai(value: string) {
    this._ai = value;
  }

  get wtt(): Number {
    return this._wtt;
  }

  set wtt(value: Number) {
    this._wtt = value;
  }

  private _pi: string = "";
  private _si: string = "";
  private _ai: string = "";
  private _wtt: Number = 0;




  cT(): string {

    let sq = 'create table if not exists gtd_d( pi varchar(50) primary key ,si varchar(50)  ,ai varchar(50) ,wtt integer);';

    return sq;
  }

  upT(): string {
    let sq = '';
    if (this._si != null && this._si != "") {
      sq = sq + ', si="' + this._si + '"';
    }

    if (this._ai != null && this._ai != "") {
      sq = sq + ', ai="' + this._ai + '"';
    }
    if (sq != null && sq != "") {
      sq = sq.substr(1);
    }
    sq = 'update gtd_d set  ' + sq + ' where pi = "' + this._pi + '";';
    return sq;
  }

  dT(): string {
    let sq = 'delete from gtd_d where 1=1 ';
    if (this._pi != null && this._pi != "") {
      sq = sq + 'and  pi ="' + this._pi + '"';
    }
    if (this._si != null && this._si != "") {
      sq = sq + 'and  si ="' + this._si + '"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT(): string {
    let sq = 'select * from gtd_d where pi = "' + this._pi + '";';
    return sq;
  }

  slT(): string {
    let sq = 'select * from  gtd_d where  1=1 ';

    if (this.pi != null) {
      sq = sq + ' and pi="' + this._pi + '"';
    }

    if (this._si != null) {
      sq = sq + ' and si="' + this._si + '"';
    }
    if (this._ai != null) {
      sq = sq + ' and ai="' + this._ai + '"';
    }

    sq = sq + ';';
    return sq;
  }

  drT(): string {

    let sq = 'drop table if exists gtd_d;';
    return sq;
  }

  inT(): string {
    let sq = 'insert into gtd_d ' +
      '( pi ,si ,ai ,wtt) values("' + this._pi + '","' + this._si + ' ","' + this._ai + '",' + moment().unix() + ');';

    return sq;
  }

  rpT(): string {
    let sq = 'replace into gtd_d ' +
      '( pi ,si   ,ai   ,wtt) values("' + this._pi + '","' + this._ai + '","' + moment().unix() + ');';

    return sq;
  }

}

