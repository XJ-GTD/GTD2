import {ITbl} from "./itbl";
import * as moment from "moment";

/**
 * create by on 2019/3/5
 * 日程总表
 */
export class StTbl implements ITbl {
  d: string = "";
  c: number = 0;
  n: boolean;
  bz: string = "";
  wtt: number = 0;

  cT(): string {

    let sq = ' create table if not exists gtd_st(d varchar(10) primary key ,c integer ,n boolean  ,bz varchar(50)  ,wtt integer);';

    return sq;
  }

  upT(): string {
    let sq = '';
    if (this.c != null) {
      sq = sq + ', c=' + this.c;
    }
    if (this.n != null) {
      sq = sq + ', n=' + this.n;
    }
    if (this.bz != null && this.bz != "") {
      sq = sq + ', bz="' + this.bz + '"';
    }
    if (sq != null && sq != "") {
      sq = sq.substr(1);
    }
    sq = 'update gtd_st set  ' + sq + ' where d = "' + this.d + '";';
    return sq;
  }

  dT(): string {
    let sq = 'delete from gtd_st where 1=2 ';
    sq = sq + ';'
    return sq;
  }

  sloT(): string {
    let sq = 'select * from gtd_st where d = "' + this.d + '";';
    return sq;
  }

  slT(): string {
    let sq = 'select * from  gtd_st where  1=1 ';
    sq = sq + ';';
    return sq;
  }

  drT(): string {

    let sq = 'drop table if exists gtd_st;';
    return sq;
  }

  inT(): string {
    let sq = 'insert into gtd_st ' +
      '( d,c,n ,bz ,wtt) values("' + this.d + '","' + this.c + '",' + this.n + ',"' + this.bz + '",' + moment().unix() + ');';

    return sq;
  }

  rpT(): string {
    let sq = 'replace into gtd_sp ' +
      '( d,c,n ,bz ,wtt) values("' + this.d + '",' + this.c + ',' + this.n + ',"' + this.bz + '",' + moment().unix() + ');';

    return sq;
  }
}


