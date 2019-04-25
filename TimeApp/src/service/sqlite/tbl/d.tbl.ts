/**
 * create by on 2019/3/5
 */
import {ITbl} from "./itbl";
import * as moment from "moment";


export class DTbl implements ITbl {


 pi: string = "";
 si: string = "";
 ai: string = "";
 wtt: Number = 0;


  cT(): string {

    let sq = 'create table if not exists gtd_d( pi varchar(50) primary key ,si varchar(50)  ,ai varchar(50) ,wtt integer);';

    return sq;
  }

  upT(): string {
    let sq = '';
    if (this.si != null && this.si != "") {
      sq = sq + ', si="' + this.si + '"';
    }

    if (this.ai != null && this.ai != "") {
      sq = sq + ', ai="' + this.ai + '"';
    }
    if (sq != null && sq != "") {
      sq = sq.substr(1);
    }
    sq = 'update gtd_d set  ' + sq + ' where pi = "' + this.pi + '";';
    return sq;
  }

  dT(): string {
    let sq = 'delete from gtd_d where 1=1 ';
    if (this.pi != null && this.pi != "") {
      sq = sq + 'and  pi ="' + this.pi + '"';
    }
    if (this.si != null && this.si != "") {
      sq = sq + 'and  si ="' + this.si + '"';
    }
    sq = sq + ';'
    return sq;
  }

  sloT(): string {
    let sq = 'select * from gtd_d where pi = "' + this.pi + '";';
    return sq;
  }

  slT(): string {
    let sq = 'select * from  gtd_d where  1=1 ';

    if (this.pi != null && this.pi != "") {
      sq = sq + ' and pi="' + this.pi + '"';
    }

    if (this.si != null && this.si != "") {
      sq = sq + ' and si="' + this.si + '"';
    }
    if (this.ai != null && this.ai != "") {
      sq = sq + ' and ai="' + this.ai + '"';
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
      '( pi ,si ,ai ,wtt) values("' + this.pi + '","' + this.si + '","' + this.ai + '",' + moment().unix() + ');';

    return sq;
  }

  rpT(): string {
    let sq = 'replace into gtd_d ' +
      '( pi ,si   ,ai   ,wtt) values("' + this.pi + '","' + this.ai + '","' + moment().unix() + ');';

    return sq;
  }

}

